"""
Plot Generation Service
Generate medical plots from WFDB data files for specialist portal
"""

import os
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from matplotlib.dates import DateFormatter
import wfdb
import json
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import base64
from io import BytesIO
from scipy import signal
from scipy.signal import find_peaks
import seaborn as sns

# Set matplotlib to use non-interactive backend
plt.switch_backend('Agg')

# Configure plot style
plt.style.use('seaborn-v0_8')
sns.set_palette("husl")

class MedicalPlotGenerator:
    """Generate medical plots from WFDB data files"""
    
    def __init__(self):
        self.figure_size = (12, 8)
        self.dpi = 100
        self.colors = {
            'ecg': '#e74c3c',
            'resp': '#3498db', 
            'pleth': '#2ecc71',
            'hr': '#f39c12',
            'spo2': '#9b59b6',
            'pulse': '#e67e22'
        }
    
    def generate_ecg_waveform_plot(self, dat_file_path: str, hea_file_path: str) -> str:
        """Generate ECG waveform plot from raw data"""
        try:
            # Load WFDB record
            record_name = dat_file_path.replace('.dat', '')
            record = wfdb.rdrecord(record_name)
            
            # Get ECG signals
            signals = record.p_signal
            signal_names = record.sig_name
            fs = record.fs
            
            # Create time vector (show last 30 seconds)
            duration = min(30, len(signals) / fs)
            start_sample = max(0, len(signals) - int(duration * fs))
            time_vector = np.arange(start_sample, len(signals)) / fs
            
            # Create figure
            fig, axes = plt.subplots(len(signal_names), 1, figsize=(14, 2*len(signal_names)), sharex=True)
            if len(signal_names) == 1:
                axes = [axes]
            
            # Plot each signal
            for i, (signal_name, ax) in enumerate(zip(signal_names, axes)):
                if i < signals.shape[1]:
                    signal_data = signals[start_sample:, i]
                    ax.plot(time_vector, signal_data, color=self.colors.get('ecg', '#e74c3c'), linewidth=0.8)
                    ax.set_ylabel(f'{signal_name}\n({record.units[i] if i < len(record.units) else "mV"})', 
                                fontsize=10)
                    ax.grid(True, alpha=0.3)
                    ax.set_title(f'{signal_name} - Last {duration:.0f} seconds', fontsize=12, pad=10)
            
            # Format x-axis
            axes[-1].set_xlabel('Time (seconds)', fontsize=12)
            plt.suptitle('ECG Waveform Analysis', fontsize=16, y=0.98)
            plt.tight_layout()
            
            # Convert to base64
            return self._fig_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating ECG plot: {str(e)}")
            return self._generate_error_plot("ECG Waveform", str(e))
    
    def generate_vital_signs_trend_plot(self, dat_normalized_path: str, hea_normalized_path: str) -> str:
        """Generate vital signs trend plot from normalized data"""
        try:
            # Load normalized WFDB record
            record_name = dat_normalized_path.replace('.dat', '')
            record = wfdb.rdrecord(record_name)
            
            signals = record.p_signal
            signal_names = record.sig_name
            fs = record.fs
            
            # Create time vector
            time_vector = np.arange(len(signals)) / fs
            time_minutes = time_vector / 60  # Convert to minutes
            
            # Create subplots
            fig, axes = plt.subplots(2, 2, figsize=(15, 10))
            fig.suptitle('Vital Signs Trend Analysis', fontsize=16, y=0.95)
            
            # Plot vital signs
            vital_signs_data = {}
            for i, signal_name in enumerate(signal_names):
                if i < signals.shape[1]:
                    signal_data = signals[:, i]
                    # Remove invalid values
                    signal_data = signal_data[~np.isnan(signal_data)]
                    signal_data = signal_data[signal_data != -32768]
                    
                    if len(signal_data) > 0:
                        vital_signs_data[signal_name] = signal_data
            
            # Heart Rate
            if 'HR' in vital_signs_data:
                axes[0, 0].plot(time_minutes[:len(vital_signs_data['HR'])], vital_signs_data['HR'], 
                               color=self.colors['hr'], linewidth=2, label='Heart Rate')
                axes[0, 0].axhline(y=60, color='green', linestyle='--', alpha=0.7, label='Normal Range')
                axes[0, 0].axhline(y=100, color='green', linestyle='--', alpha=0.7)
                axes[0, 0].fill_between(time_minutes[:len(vital_signs_data['HR'])], 60, 100, alpha=0.1, color='green')
                axes[0, 0].set_title('Heart Rate (bpm)', fontsize=14)
                axes[0, 0].set_ylabel('bpm')
                axes[0, 0].grid(True, alpha=0.3)
                axes[0, 0].legend()
            
            # Respiratory Rate
            if 'RESP' in vital_signs_data:
                axes[0, 1].plot(time_minutes[:len(vital_signs_data['RESP'])], vital_signs_data['RESP'], 
                               color=self.colors['resp'], linewidth=2, label='Respiratory Rate')
                axes[0, 1].axhline(y=12, color='green', linestyle='--', alpha=0.7, label='Normal Range')
                axes[0, 1].axhline(y=20, color='green', linestyle='--', alpha=0.7)
                axes[0, 1].fill_between(time_minutes[:len(vital_signs_data['RESP'])], 12, 20, alpha=0.1, color='green')
                axes[0, 1].set_title('Respiratory Rate (breaths/min)', fontsize=14)
                axes[0, 1].set_ylabel('breaths/min')
                axes[0, 1].grid(True, alpha=0.3)
                axes[0, 1].legend()
            
            # SpO2
            if 'SpO2' in vital_signs_data:
                axes[1, 0].plot(time_minutes[:len(vital_signs_data['SpO2'])], vital_signs_data['SpO2'], 
                               color=self.colors['spo2'], linewidth=2, label='SpO2')
                axes[1, 0].axhline(y=95, color='green', linestyle='--', alpha=0.7, label='Normal Range')
                axes[1, 0].axhline(y=100, color='green', linestyle='--', alpha=0.7)
                axes[1, 0].fill_between(time_minutes[:len(vital_signs_data['SpO2'])], 95, 100, alpha=0.1, color='green')
                axes[1, 0].set_title('Oxygen Saturation (%)', fontsize=14)
                axes[1, 0].set_ylabel('%')
                axes[1, 0].grid(True, alpha=0.3)
                axes[1, 0].legend()
            
            # Pulse Rate
            if 'PULSE' in vital_signs_data:
                axes[1, 1].plot(time_minutes[:len(vital_signs_data['PULSE'])], vital_signs_data['PULSE'], 
                               color=self.colors['pulse'], linewidth=2, label='Pulse Rate')
                axes[1, 1].axhline(y=60, color='green', linestyle='--', alpha=0.7, label='Normal Range')
                axes[1, 1].axhline(y=100, color='green', linestyle='--', alpha=0.7)
                axes[1, 1].fill_between(time_minutes[:len(vital_signs_data['PULSE'])], 60, 100, alpha=0.1, color='green')
                axes[1, 1].set_title('Pulse Rate (bpm)', fontsize=14)
                axes[1, 1].set_ylabel('bpm')
                axes[1, 1].grid(True, alpha=0.3)
                axes[1, 1].legend()
            
            # Set common x-axis label
            for ax in axes.flat:
                ax.set_xlabel('Time (minutes)')
            
            plt.tight_layout()
            return self._fig_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating vital signs trend plot: {str(e)}")
            return self._generate_error_plot("Vital Signs Trend", str(e))
    
    def generate_respiratory_pattern_plot(self, dat_file_path: str, hea_file_path: str, 
                                        breath_annotation_path: str) -> str:
        """Generate respiratory pattern analysis plot"""
        try:
            # Load WFDB record
            record_name = dat_file_path.replace('.dat', '')
            record = wfdb.rdrecord(record_name)
            
            signals = record.p_signal
            signal_names = record.sig_name
            fs = record.fs
            
            # Find respiratory signal
            resp_signal = None
            resp_idx = None
            for i, name in enumerate(signal_names):
                if 'RESP' in name.upper():
                    resp_signal = signals[:, i]
                    resp_idx = i
                    break
            
            if resp_signal is None:
                return self._generate_error_plot("Respiratory Pattern", "No respiratory signal found")
            
            # Create time vector (show last 2 minutes)
            duration = min(120, len(resp_signal) / fs)
            start_sample = max(0, len(resp_signal) - int(duration * fs))
            time_vector = np.arange(start_sample, len(resp_signal)) / fs
            resp_data = resp_signal[start_sample:]
            
            # Create figure with subplots
            fig, axes = plt.subplots(3, 1, figsize=(14, 12))
            fig.suptitle('Respiratory Pattern Analysis', fontsize=16, y=0.95)
            
            # Plot 1: Raw respiratory signal
            axes[0].plot(time_vector, resp_data, color=self.colors['resp'], linewidth=1.5)
            axes[0].set_title('Respiratory Waveform', fontsize=14)
            axes[0].set_ylabel('Amplitude')
            axes[0].grid(True, alpha=0.3)
            
            # Plot 2: Respiratory rate estimation
            # Use sliding window to estimate respiratory rate
            window_size = int(10 * fs)  # 10 second windows
            step_size = int(2 * fs)     # 2 second steps
            
            rates = []
            times = []
            
            for i in range(0, len(resp_data) - window_size, step_size):
                window = resp_data[i:i+window_size]
                
                # Find peaks (breaths)
                peaks, _ = find_peaks(window, height=np.mean(window), distance=int(fs))
                
                # Calculate rate (breaths per minute)
                if len(peaks) > 1:
                    rate = len(peaks) * 60 / (window_size / fs)
                    rates.append(rate)
                    times.append(time_vector[i + window_size//2])
            
            if rates:
                axes[1].plot(times, rates, color=self.colors['hr'], linewidth=2, marker='o', markersize=4)
                axes[1].axhline(y=12, color='green', linestyle='--', alpha=0.7, label='Normal Range')
                axes[1].axhline(y=20, color='green', linestyle='--', alpha=0.7)
                axes[1].fill_between(times, 12, 20, alpha=0.1, color='green')
                axes[1].set_title('Respiratory Rate Over Time', fontsize=14)
                axes[1].set_ylabel('Breaths/min')
                axes[1].grid(True, alpha=0.3)
                axes[1].legend()
            
            # Plot 3: Breathing pattern analysis
            # Calculate breathing cycle statistics
            if rates:
                mean_rate = np.mean(rates)
                std_rate = np.std(rates)
                
                # Create histogram of breathing rates
                axes[2].hist(rates, bins=15, color=self.colors['resp'], alpha=0.7, edgecolor='black')
                axes[2].axvline(mean_rate, color='red', linestyle='--', linewidth=2, 
                               label=f'Mean: {mean_rate:.1f} breaths/min')
                axes[2].axvline(mean_rate - std_rate, color='orange', linestyle=':', alpha=0.7)
                axes[2].axvline(mean_rate + std_rate, color='orange', linestyle=':', alpha=0.7, 
                               label=f'±1 SD: {std_rate:.1f}')
                axes[2].set_title('Breathing Rate Distribution', fontsize=14)
                axes[2].set_xlabel('Breaths per minute')
                axes[2].set_ylabel('Frequency')
                axes[2].legend()
                axes[2].grid(True, alpha=0.3)
            
            # Set common x-axis label for time plots
            axes[0].set_xlabel('Time (seconds)')
            axes[1].set_xlabel('Time (seconds)')
            
            plt.tight_layout()
            return self._fig_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating respiratory pattern plot: {str(e)}")
            return self._generate_error_plot("Respiratory Pattern", str(e))
    
    def generate_hrv_analysis_plot(self, dat_file_path: str, hea_file_path: str) -> str:
        """Generate HRV analysis plot"""
        try:
            # Load WFDB record
            record_name = dat_file_path.replace('.dat', '')
            record = wfdb.rdrecord(record_name)
            
            signals = record.p_signal
            signal_names = record.sig_name
            fs = record.fs
            
            # Find ECG signal
            ecg_signal = None
            for i, name in enumerate(signal_names):
                if 'ECG' in name.upper() or 'II' in name.upper() or 'V' in name.upper():
                    ecg_signal = signals[:, i]
                    break
            
            if ecg_signal is None:
                return self._generate_error_plot("HRV Analysis", "No ECG signal found")
            
            # Simple R-peak detection (for demonstration)
            # In practice, you'd use more sophisticated algorithms
            from scipy.signal import find_peaks
            
            # Normalize signal
            ecg_normalized = (ecg_signal - np.mean(ecg_signal)) / np.std(ecg_signal)
            
            # Find R-peaks
            peaks, _ = find_peaks(ecg_normalized, height=1.5, distance=int(0.6*fs))
            
            if len(peaks) < 10:
                return self._generate_error_plot("HRV Analysis", "Insufficient R-peaks detected")
            
            # Calculate RR intervals
            rr_intervals = np.diff(peaks) / fs * 1000  # in milliseconds
            
            # Calculate HRV metrics
            sdnn = np.std(rr_intervals)
            rmssd = np.sqrt(np.mean(np.diff(rr_intervals)**2))
            pnn50 = np.sum(np.abs(np.diff(rr_intervals)) > 50) / len(rr_intervals) * 100
            
            # Create figure
            fig, axes = plt.subplots(2, 2, figsize=(15, 10))
            fig.suptitle('Heart Rate Variability Analysis', fontsize=16, y=0.95)
            
            # Plot 1: ECG with R-peaks
            time_ecg = np.arange(len(ecg_signal)) / fs
            axes[0, 0].plot(time_ecg, ecg_normalized, color=self.colors['ecg'], linewidth=0.8, alpha=0.7)
            axes[0, 0].plot(peaks/fs, ecg_normalized[peaks], 'ro', markersize=4, label='R-peaks')
            axes[0, 0].set_title('ECG with R-peak Detection', fontsize=14)
            axes[0, 0].set_xlabel('Time (seconds)')
            axes[0, 0].set_ylabel('Normalized Amplitude')
            axes[0, 0].legend()
            axes[0, 0].grid(True, alpha=0.3)
            
            # Plot 2: RR interval tachogram
            time_rr = peaks[1:] / fs
            axes[0, 1].plot(time_rr, rr_intervals, color=self.colors['hr'], linewidth=2, marker='o', markersize=3)
            axes[0, 1].set_title('RR Interval Tachogram', fontsize=14)
            axes[0, 1].set_xlabel('Time (seconds)')
            axes[0, 1].set_ylabel('RR Interval (ms)')
            axes[0, 1].grid(True, alpha=0.3)
            
            # Plot 3: RR interval histogram
            axes[1, 0].hist(rr_intervals, bins=20, color=self.colors['hr'], alpha=0.7, edgecolor='black')
            axes[1, 0].axvline(np.mean(rr_intervals), color='red', linestyle='--', linewidth=2, 
                              label=f'Mean: {np.mean(rr_intervals):.1f} ms')
            axes[1, 0].set_title('RR Interval Distribution', fontsize=14)
            axes[1, 0].set_xlabel('RR Interval (ms)')
            axes[1, 0].set_ylabel('Frequency')
            axes[1, 0].legend()
            axes[1, 0].grid(True, alpha=0.3)
            
            # Plot 4: HRV metrics
            metrics = ['SDNN', 'RMSSD', 'pNN50']
            values = [sdnn, rmssd, pnn50]
            colors = [self.colors['hr'], self.colors['resp'], self.colors['spo2']]
            
            bars = axes[1, 1].bar(metrics, values, color=colors, alpha=0.7, edgecolor='black')
            axes[1, 1].set_title('HRV Metrics', fontsize=14)
            axes[1, 1].set_ylabel('Value')
            
            # Add value labels on bars
            for bar, value in zip(bars, values):
                height = bar.get_height()
                axes[1, 1].text(bar.get_x() + bar.get_width()/2., height + height*0.01,
                               f'{value:.1f}', ha='center', va='bottom')
            
            axes[1, 1].grid(True, alpha=0.3)
            
            plt.tight_layout()
            return self._fig_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating HRV analysis plot: {str(e)}")
            return self._generate_error_plot("HRV Analysis", str(e))
    
    def generate_combined_dashboard_plot(self, dat_file_path: str, hea_file_path: str,
                                       dat_normalized_path: str, hea_normalized_path: str) -> str:
        """Generate combined dashboard plot with all vital signs"""
        try:
            # Load both records
            record_name = dat_file_path.replace('.dat', '')
            record = wfdb.rdrecord(record_name)
            
            record_norm_name = dat_normalized_path.replace('.dat', '')
            record_norm = wfdb.rdrecord(record_norm_name)
            
            # Create figure
            fig = plt.figure(figsize=(16, 12))
            gs = fig.add_gridspec(3, 3, height_ratios=[1, 1, 1], width_ratios=[2, 1, 1])
            
            fig.suptitle('Complete Vital Signs Dashboard', fontsize=18, y=0.95)
            
            # ECG waveform (large plot)
            ax1 = fig.add_subplot(gs[0, :])
            signals = record.p_signal
            signal_names = record.sig_name
            fs = record.fs
            
            # Show last 10 seconds of ECG
            duration = min(10, len(signals) / fs)
            start_sample = max(0, len(signals) - int(duration * fs))
            time_vector = np.arange(start_sample, len(signals)) / fs
            
            # Plot first ECG signal
            for i, name in enumerate(signal_names):
                if 'ECG' in name.upper() or 'II' in name.upper() or 'V' in name.upper():
                    signal_data = signals[start_sample:, i]
                    ax1.plot(time_vector, signal_data, color=self.colors['ecg'], linewidth=1.5)
                    ax1.set_title(f'ECG Waveform - {name} (Last {duration:.0f}s)', fontsize=14)
                    break
            
            ax1.set_xlabel('Time (seconds)')
            ax1.set_ylabel('Amplitude (mV)')
            ax1.grid(True, alpha=0.3)
            
            # Vital signs from normalized data
            norm_signals = record_norm.p_signal
            norm_signal_names = record_norm.sig_name
            
            # Heart Rate
            ax2 = fig.add_subplot(gs[1, 0])
            for i, name in enumerate(norm_signal_names):
                if 'HR' in name.upper():
                    hr_data = norm_signals[:, i]
                    hr_data = hr_data[~np.isnan(hr_data)]
                    hr_data = hr_data[hr_data != -32768]
                    if len(hr_data) > 0:
                        time_hr = np.arange(len(hr_data)) / record_norm.fs / 60
                        ax2.plot(time_hr, hr_data, color=self.colors['hr'], linewidth=2)
                        ax2.axhline(y=60, color='green', linestyle='--', alpha=0.5)
                        ax2.axhline(y=100, color='green', linestyle='--', alpha=0.5)
                        ax2.fill_between(time_hr, 60, 100, alpha=0.1, color='green')
                    break
            ax2.set_title('Heart Rate', fontsize=12)
            ax2.set_ylabel('bpm')
            ax2.set_xlabel('Time (min)')
            ax2.grid(True, alpha=0.3)
            
            # Respiratory Rate
            ax3 = fig.add_subplot(gs[1, 1])
            for i, name in enumerate(norm_signal_names):
                if 'RESP' in name.upper():
                    resp_data = norm_signals[:, i]
                    resp_data = resp_data[~np.isnan(resp_data)]
                    resp_data = resp_data[resp_data != -32768]
                    if len(resp_data) > 0:
                        time_resp = np.arange(len(resp_data)) / record_norm.fs / 60
                        ax3.plot(time_resp, resp_data, color=self.colors['resp'], linewidth=2)
                        ax3.axhline(y=12, color='green', linestyle='--', alpha=0.5)
                        ax3.axhline(y=20, color='green', linestyle='--', alpha=0.5)
                        ax3.fill_between(time_resp, 12, 20, alpha=0.1, color='green')
                    break
            ax3.set_title('Respiratory Rate', fontsize=12)
            ax3.set_ylabel('breaths/min')
            ax3.set_xlabel('Time (min)')
            ax3.grid(True, alpha=0.3)
            
            # SpO2
            ax4 = fig.add_subplot(gs[1, 2])
            for i, name in enumerate(norm_signal_names):
                if 'SPO2' in name.upper():
                    spo2_data = norm_signals[:, i]
                    spo2_data = spo2_data[~np.isnan(spo2_data)]
                    spo2_data = spo2_data[spo2_data != -32768]
                    if len(spo2_data) > 0:
                        time_spo2 = np.arange(len(spo2_data)) / record_norm.fs / 60
                        ax4.plot(time_spo2, spo2_data, color=self.colors['spo2'], linewidth=2)
                        ax4.axhline(y=95, color='green', linestyle='--', alpha=0.5)
                        ax4.axhline(y=100, color='green', linestyle='--', alpha=0.5)
                        ax4.fill_between(time_spo2, 95, 100, alpha=0.1, color='green')
                    break
            ax4.set_title('SpO2', fontsize=12)
            ax4.set_ylabel('%')
            ax4.set_xlabel('Time (min)')
            ax4.grid(True, alpha=0.3)
            
            # Summary statistics
            ax5 = fig.add_subplot(gs[2, :])
            
            # Calculate summary stats
            stats_text = "VITAL SIGNS SUMMARY\n\n"
            
            for i, name in enumerate(norm_signal_names):
                if i < norm_signals.shape[1]:
                    data = norm_signals[:, i]
                    data = data[~np.isnan(data)]
                    data = data[data != -32768]
                    
                    if len(data) > 0:
                        mean_val = np.mean(data)
                        std_val = np.std(data)
                        min_val = np.min(data)
                        max_val = np.max(data)
                        
                        stats_text += f"{name}: Mean={mean_val:.1f}, SD={std_val:.1f}, Range=[{min_val:.1f}, {max_val:.1f}]\n"
            
            ax5.text(0.05, 0.95, stats_text, transform=ax5.transAxes, fontsize=10, 
                    verticalalignment='top', fontfamily='monospace',
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="lightgray", alpha=0.8))
            ax5.set_xlim(0, 1)
            ax5.set_ylim(0, 1)
            ax5.axis('off')
            
            plt.tight_layout()
            return self._fig_to_base64(fig)
            
        except Exception as e:
            print(f"Error generating combined dashboard plot: {str(e)}")
            return self._generate_error_plot("Combined Dashboard", str(e))
    
    def _fig_to_base64(self, fig) -> str:
        """Convert matplotlib figure to base64 string"""
        buffer = BytesIO()
        fig.savefig(buffer, format='png', dpi=self.dpi, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.read()).decode('utf-8')
        plt.close(fig)
        return f"data:image/png;base64,{image_base64}"
    
    def _generate_error_plot(self, plot_type: str, error_message: str) -> str:
        """Generate an error plot when data processing fails"""
        fig, ax = plt.subplots(figsize=(10, 6))
        ax.text(0.5, 0.5, f"Error generating {plot_type}\n\n{error_message}", 
                horizontalalignment='center', verticalalignment='center',
                transform=ax.transAxes, fontsize=14, 
                bbox=dict(boxstyle="round,pad=0.5", facecolor="lightcoral", alpha=0.8))
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis('off')
        ax.set_title(f"{plot_type} - Error", fontsize=16)
        plt.tight_layout()
        return self._fig_to_base64(fig)

# Global instance
plot_generator = MedicalPlotGenerator() 
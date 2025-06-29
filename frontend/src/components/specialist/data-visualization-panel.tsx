import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, LineChart, PieChart, ScatterChart } from "lucide-react"

export function DataVisualizationPanel() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-primary">Data Visualization Suite</CardTitle>
        <CardDescription>Visual analysis of patient's physiological data.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ECG & PPG Waveforms</CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">ECG/PPG chart placeholder (zoom/pan)</p>
            </div>
          </CardContent>
        </Card>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vital Sign Trends (8-min)</CardTitle>
              <LineChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">Time-series line chart placeholder</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Respiratory Patterns</CardTitle>
              <BarChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">Breathing waveform placeholder</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">HRV Analysis</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">HRV charts placeholder</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Vital Sign Correlations</CardTitle>
              <ScatterChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="h-40 flex items-center justify-center bg-gray-100 rounded-md">
                <p className="text-muted-foreground">Scatter plot placeholder</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}

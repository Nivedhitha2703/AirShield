import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

interface ShapChartProps {
  shap: Record<string, number>
}

function ShapChart({ shap }: ShapChartProps) {
  const data = Object.entries(shap).map(([name, value]) => ({
    name,
    value,
  }))

  return (
    <div className="card shap-card">
      <div className="card-heading">
        <div>
          <span className="card-kicker">EXPLAINABLE AI</span>
          <h3>Why is the risk HIGH?</h3>
        </div>
      </div>

      <p>
        Key factors contributing to the current AI risk prediction.
      </p>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height={270}>
          <BarChart
            data={data}
            layout="vertical"
            margin={{
              top: 5,
              right: 20,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
            />

            <XAxis type="number" />

            <YAxis
              type="category"
              dataKey="name"
              width={105}
            />

            <Tooltip />

            <Bar
              dataKey="value"
              fill="#0f766e"
              radius={[0, 6, 6, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default ShapChart
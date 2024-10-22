import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface CardInfo {
  title: string;
  value: string | number;
  text: string;
}

interface AreaCardProps {
  colors: string[];
  percentFillValue: number;
  cardInfo: CardInfo;
  showChart?: boolean; // New prop to control chart visibility
}

const AreaCard: React.FC<AreaCardProps> = ({ colors, percentFillValue, cardInfo, showChart = true }) => {
  const filledValue = (percentFillValue / 100) * 360; // 360 degrees for a full circle
  const remainedValue = 360 - filledValue;

  const data = [
    { name: "Completed tasks", value: remainedValue },
    { name: "Pending Tasks", value: filledValue },
  ];

  const renderTooltipContent = (value: number) => {
    return `${(value / 360) * 100} %`;
  };

  return (
    <div className="area-card">
      <div className="area-card-info">
        <h5 className="info-title">{cardInfo.title}</h5>
        <div className="info-value">{cardInfo.value}</div>
        <p className="info-text">{cardInfo.text}</p>
      </div>
      {showChart && ( // Conditional rendering of the chart
        <div className="area-card-chart">
          <PieChart width={100} height={100}>
            <Pie
              data={data}
              cx={50}
              cy={45}
              innerRadius={20}
              fill="#e4e8ef"
              paddingAngle={0}
              dataKey="value"
              startAngle={-270}
              endAngle={150}
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <Tooltip formatter={renderTooltipContent} />
          </PieChart>
        </div>
      )}
    </div>
  );
};

export default AreaCard;

AreaCard.propTypes = {
  colors: PropTypes.array.isRequired,
  percentFillValue: PropTypes.number.isRequired,
  cardInfo: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
  showChart: PropTypes.bool, // Prop type for showChart
};

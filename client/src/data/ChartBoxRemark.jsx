import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons";
import { ChartBox } from "../Dashboard/Db2";

const ChartBoxRemark = ({
  dashboardData,
  dashboardWeeklyRemarks,
  dashboardRemarkPercent,
  dashboardLoading
}) => {
  const [chartDataRemark, setChartDataRemark] = useState([]);
  const [weeklyRemarks, setWeeklyRemarks] = useState([]);
  const [remarkPercent, setRemarkPercent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChartDataRemark(dashboardData);
        setWeeklyRemarks(dashboardWeeklyRemarks);
        setRemarkPercent(dashboardRemarkPercent);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(dashboardLoading);
      }
    };
    fetchData();
  }, [dashboardData, dashboardWeeklyRemarks, dashboardRemarkPercent, dashboardLoading]);

  const chartBox2 = {
    color: "orange",
    icon: <FontAwesomeIcon icon={faNoteSticky} />,
    title: "Total Remarks",
    number: loading ? "Loading..." : chartDataRemark.totalRemarks,
    dataKey: "Remarks",
    percentage: loading ? "..." : remarkPercent,
    chartData: weeklyRemarks,
  };

  return <ChartBox {...chartBox2} />;
};

export default ChartBoxRemark;

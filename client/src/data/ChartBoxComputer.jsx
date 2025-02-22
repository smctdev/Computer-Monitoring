import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComputer } from "@fortawesome/free-solid-svg-icons";
import { ChartBox } from "../Dashboard/Db2";

const ChartBoxComputer = ({
  dashboardData,
  dashboardWeeklyComputers,
  dashboardComputerPercent,
  dashboardLoading,
}) => {
  const [chartDataComputer, setChartDataComputer] = useState([]);
  const [weeklyComputers, setWeeklyComputers] = useState([]);
  const [computerPercent, setComputerPercent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChartDataComputer(dashboardData);
        setWeeklyComputers(dashboardWeeklyComputers);
        setComputerPercent(dashboardComputerPercent);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(dashboardLoading);
      }
    };
    fetchData();
  }, [dashboardData, dashboardWeeklyComputers, dashboardComputerPercent, dashboardLoading]);

  const chartBoxComputer = {
    color: "brown",
    icon: <FontAwesomeIcon icon={faComputer} />,
    title: "Total Computers",
    number: loading ? "Loading..." : chartDataComputer.totalComputers,
    dataKey: "Computers",
    percentage: loading ? "..." : computerPercent,
    chartData: weeklyComputers,
  };

  return <ChartBox {...chartBoxComputer} />;
};

export default ChartBoxComputer;

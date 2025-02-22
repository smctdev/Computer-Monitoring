import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop } from "@fortawesome/free-solid-svg-icons";
import { ChartBox } from "../Dashboard/Db2";

const ChartBoxUser = ({
  dashboardData,
  dashboardWeeklyUnits,
  dashboardUnitPercent,
  dashboardLoading
}) => {
  const [chartDataUnit, setChartDataUnit] = useState([]);
  const [weeklyUnits, setWeeklyUnits] = useState([]);
  const [unitPercent, setUnitPercent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChartDataUnit(dashboardData);
        setWeeklyUnits(dashboardWeeklyUnits);
        setUnitPercent(dashboardUnitPercent);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(dashboardLoading);
      }
    };
    fetchData();
  }, [dashboardData, dashboardWeeklyUnits, dashboardUnitPercent, dashboardLoading]);

  const chartBox1 = {
    color: "#000080",
    icon: <FontAwesomeIcon icon={faDesktop} />,
    title: "Total Units",
    number: loading ? "Loading..." : chartDataUnit.totalUnits,
    dataKey: "Units",
    percentage: loading ? "..." : unitPercent,
    chartData: weeklyUnits,
  };

  return <ChartBox {...{ ...chartBox1 }} />;
};

export default ChartBoxUser;

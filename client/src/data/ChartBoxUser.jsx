import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { ChartBox } from "../Dashboard/Db2";

const ChartBoxUser = ({
  dashboardData,
  dashboardWeeklyUsers,
  dashboardUserPercent,
  dashboardLoading,
}) => {
  const [chartDataUser, setChartDataUser] = useState([]);
  const [weeklyUsers, setWeeklyUsers] = useState([]);
  const [userPercent, setUserPercent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setChartDataUser(dashboardData);
        setWeeklyUsers(dashboardWeeklyUsers);
        setUserPercent(dashboardUserPercent);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(dashboardLoading);
      }
    };
    fetchData();
  }, [
    dashboardData,
    dashboardWeeklyUsers,
    dashboardUserPercent,
    dashboardLoading,
  ]);

  const chartBoxUser = {
    color: "#ffff00",
    icon: <FontAwesomeIcon icon={faUsers} />,
    title: "Total Users",
    number: loading ? "Loading..." : chartDataUser.totalUsers,
    dataKey: "Users",
    percentage: loading ? "..." : userPercent,
    chartData: weeklyUsers,
  };

  return <ChartBox {...chartBoxUser} />;
};

export default ChartBoxUser;

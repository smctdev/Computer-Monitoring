import { useEffect, useState } from "react";
import profile from "../img/profile.png";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  Bar,
  BarChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts";
import ChartBoxUser from "../data/ChartBoxUser";
import ChartBoxUnit from "../data/ChartBoxUnit";
import ChartBoxComputer from "../data/ChartBoxComputer";
import ChartBoxRemark from "../data/ChartBoxRemark";
import api from "../api/axios";

function TopBox({ dashboardData, dashboardLoading }) {
  const [userFormatted, setUserFormatted] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserFormatted(dashboardData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(dashboardLoading);
      }
    };
    fetchData();
  }, [dashboardData, dashboardLoading]);

  const dataUsers = userFormatted;
  return (
    <div className="topBox ">
      <h1 className="mb-5 text-xl font-bold">
        Top Users with Most Formatted Computers
      </h1>
      <div className="list">
        {loading ? (
          "Loading..."
        ) : dataUsers.length === 0 ? (
          <p className="text-center">No users have formatted computers yet.</p>
        ) : (
          dataUsers.map((user, index) => (
            <div
              className="flex items-center justify-between mb-8 listItem"
              key={index}
            >
              <div className="flex gap-5 user">
                <img
                  className="object-cover w-10 h-10 rounded-full"
                  src={user.img}
                  alt="User"
                />
                <div className="flex flex-col gap-1 userText">
                  <span className="text-sm font-medium username">
                    {user.username}
                  </span>
                  <span className="overflow-hidden text-xs break-all text-wrap text-ellipsis email">{user.email}</span>
                </div>
              </div>
              <span
                className="font-medium bcode"
                style={{ color: user.many < 5 ? "limegreen" : "tomato" }}
              >
                {user.many}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ChartBox(props) {
  const { icon, chartData, title, dataKey, color, percentage, number } = props;
  return (
    <div className="flex h-full chartBox">
      <div
        className="flex flex-col justify-between boxInfo"
        style={{ flex: "3" }}
      >
        <div className="flex items-center gap-2 title">
          <p className="text-white">{icon}</p>
          <span className="text-base font-medium text-white">
            {title}
          </span>
        </div>
        <h1 className="text-xl font-bold text-white">{number}</h1>
        <Link to="#" style={{ color: "white" }}></Link>
      </div>
      <div
        className="flex flex-col justify-between chartInfo"
        style={{ flex: "2" }}
      >
        <div className="w-full h-full chart">
          <ResponsiveContainer width="99%" height="100%">
            <LineChart data={chartData}>
              <Tooltip
                contentStyle={{ background: "transparent", border: "none" }}
                labelStyle={{ display: "none" }}
                position={{ x: 10, y: 60 }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke={color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col text-right text">
          <span
            className="text-xl font-bold percentage"
            style={{ color: color }}
          >
            {percentage}%
          </span>
          <span className="text-sm text-white duration">This Month</span>
        </div>
      </div>
    </div>
  );
}

function BarChartBox(props) {
  return (
    <div className="w-full h-full barChartBox">
      <h1 className="mb-3 text-xl">{props.title}</h1>
      <div className="chart">
        {props.hasData ? (
          <ResponsiveContainer width="99%" height={120}>
            <BarChart data={props.chartData}>
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "5px" }}
                labelStyle={{ display: "none" }}
                cursor={{ fill: "none" }}
              />
              <Bar dataKey={props.dataKey} fill={props.color} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center">No data found</p>
        )}
      </div>
    </div>
  );
}

function BarChartBoxLog(props) {
  return (
    <div className="w-full h-full barChartBoxLog">
      <h1 className="mb-3 text-xl">{props.title}</h1>
      <div className="chart">
        {props.hasLogData ? (
          <ResponsiveContainer width="99%" height={120}>
            <BarChart data={props.chartData}>
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "5px" }}
                labelStyle={{ display: "none" }}
                cursor={{ fill: "none" }}
              />
              <Bar dataKey={props.dataKey} fill={props.color} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center">No data found</p>
        )}
      </div>
    </div>
  );
}

function PieChartBox({ dashboardData, dashboardLoading }) {
  const [pieData, setPieData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setPieData(dashboardData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(dashboardLoading);
      }
    };
    fetchData();
  }, [dashboardData, dashboardLoading]);

  const data = [
    { name: "Using", value: pieData.totalUsed, color: "#008bf2" },
    { name: "Vacant", value: pieData.totalVacant, color: "#00c49f" },
    { name: "Defective", value: pieData.totalDefective, color: "#ffbb28" },
    { name: "Transfer", value: pieData.totalUsedTransfer, color: "#ff8042" },
  ];
  return (
    <div className="relative flex flex-col justify-between h-full pieChartBox">
      <h1 className="mt-5 ml-5 text-2xl font-bold">Status</h1>
      <div className="flex items-center justify-center w-full h-full chart">
        <ResponsiveContainer width="100%" height={300}>
          <div
            className="absolute text-xs options"
            style={{
              top: "54%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            {loading ? (
              <div className="flex flex-col items-center gap-1 option">
                <div className="flex items-center gap-1 title">
                  <strong>Loading...</strong>
                </div>
              </div>
            ) : (
              data.map((item, index) => (
                <ul key={index}>
                  <li>
                    <div className="flex flex-col items-center gap-1 option">
                      <div className="flex items-center gap-1 title">
                        <div
                          className="w-3 h-3 rounded-full dot"
                          style={{ backgroundColor: item.color }}
                        />
                        <span>{item.name}</span>
                      </div>
                      <span>{item.value}</span>
                    </div>
                  </li>
                </ul>
              ))
            )}
          </div>
          {loading ? (
            ""
          ) : (
            <PieChart>
              <Tooltip
                contentStyle={{ background: "white", borderRadius: "5px" }}
              />
              <Pie
                data={data}
                innerRadius={"70%"}
                outerRadius={"90%"}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function BigChartBox({ dashboardData, dashboardLoading }) {
  const [analyticsData, setAnalyticsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setAnalyticsData(dashboardData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(dashboardLoading);
      }
    };
    fetchData();
  }, [dashboardData, dashboardLoading]);
  return (
    <div className="flex flex-col justify-between w-full h-full bigChartBox">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <div className="w-full chart h-80">
        <ResponsiveContainer width="99%" height="100%">
          {loading ? (
            <p className="mt-20 text-center">
              <strong>Loading...</strong>
            </p>
          ) : (
            <AreaChart
              width={500}
              height={400}
              data={analyticsData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="set"
                stackId="1"
                stroke="#8884d8"
                fill="#8884d8"
              />
              <Area
                type="monotone"
                dataKey="unit"
                stackId="1"
                stroke="#82ca9d"
                fill="#82ca9d"
              />
              <Area
                type="monotone"
                dataKey="users"
                stackId="1"
                stroke="#ffc658"
                fill="#ffc658"
              />
            </AreaChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Dashboard() {
  const [weeklyRemarks, setWeeklyRemarks] = useState([]);
  const [weeklyLogs, setWeeklyLogs] = useState([]);
  const [hasData, setHasData] = useState([]);
  const [hasLogData, setHasLogData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [computersDatas, setComputersDatas] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [chartDataUser, setChartDataUser] = useState([]);
  const [weeklyUsers, setWeeklyUsers] = useState([]);
  const [userPercent, setUserPercent] = useState([]);
  const [chartDataUnit, setChartDataUnit] = useState([]);
  const [weeklyUnits, setWeeklyUnits] = useState([]);
  const [unitPercent, setUnitPercent] = useState([]);
  const [chartDataComputer, setChartDataComputer] = useState([]);
  const [weeklyComputers, setWeeklyComputers] = useState([]);
  const [computerPercent, setComputerPercent] = useState([]);
  const [chartDataRemark, setChartDataRemark] = useState([]);
  const [weeklyRemarksBox, setWeeklyRemarksBox] = useState([]);
  const [remarkPercent, setRemarkPercent] = useState([]);
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchWeeklyDatas = async () => {
      try {
        const response = await api.get("/dashboard");
        const remarksDatas = response.data.weeklyRemarks.map((day) => ({
          name: day.name.substring(0, 3),
          Remarks: day.Remarks,
        }));

        setWeeklyRemarks(remarksDatas);
        const data = remarksDatas.some((day) => day.Remarks > 0);
        setHasData(data);

        const logsDatas = response.data.weeklyLogs.map((day) => ({
          name: day.name.substring(0, 3),
          Logs: day.Logs,
        }));

        setWeeklyLogs(logsDatas);
        const dataLog = logsDatas.some((day) => day.Logs > 0);
        setHasLogData(dataLog);

        const computersDatas = response.data.usersFormatted.map((user) => ({
          username: user.computer_user.name,
          img: profile,
          email: user.computer_user.email,
          many: user.formatted_status,
        }));
        setComputersDatas(computersDatas);
        setPieData(response.data);
        setChartDataUser(response.data);

        const usersData = response.data.weeklyUsers.map((day) => ({
          name: day.name.substring(0, 3),
          Users: day.users,
        }));

        setWeeklyUsers(usersData);
        setUserPercent(response.data.usersPercent);

        setChartDataUnit(response.data);
        const unitsData = response.data.weeklyUnits.map((day) => ({
          name: day.name.substring(0, 3),
          Units: day.units,
        }));

        setWeeklyUnits(unitsData);
        setUnitPercent(response.data.unitsPercent);

        setChartDataComputer(response.data);

        const computersData = response.data.weeklyComputers.map((day) => ({
          name: day.name.substring(0, 3),
          Computers: day.Computers,
        }));
        setWeeklyComputers(computersData);
        setComputerPercent(response.data.computersPercent);

        setChartDataRemark(response.data);
        const remarksData = response.data.weeklyRemarks.map((day) => ({
          name: day.name.substring(0, 3),
          Remarks: day.Remarks,
        }));

        setWeeklyRemarksBox(remarksData);
        setRemarkPercent(response.data.remarksPercent);

        const formattedData = response.data.analytics.map((analytic) => ({
          name: analytic.name,
          unit: analytic.units_count,
        }));
        setAnalyticsData(formattedData);
      } catch (error) {
        console.error("Error fetching chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyDatas();
  }, []);
  
  return (
    <div
      className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4"
      style={{ gridAutoRows: "minmax(180px, auto)" }}
    >
      <div className="col-span-1 row-span-1 p-5 bg-blue-100 border border-gray-100 md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-3 rounded-xl">
        <TopBox dashboardData={computersDatas} dashboardLoading={loading} />
      </div>
      <div className="col-span-1 p-5 bg-green-500 border border-gray-100 rounded-xl">
        <ChartBoxUser
          dashboardData={chartDataUser}
          dashboardWeeklyUsers={weeklyUsers}
          dashboardUserPercent={userPercent}
          dashboardLoading={loading}
        />
      </div>
      <div className="col-span-1 p-5 border border-gray-100 rounded-xl bg-rose-500">
        <ChartBoxUnit
          dashboardData={chartDataUnit}
          dashboardWeeklyUnits={weeklyUnits}
          dashboardUnitPercent={unitPercent}
          dashboardLoading={loading}
        />
      </div>
      <div className="col-span-1 row-span-1 p-5 bg-blue-100 border border-gray-100 md:col-span-1 lg:col-span-1 md:row-span-1 lg:row-span-3 rounded-xl">
        <PieChartBox dashboardData={pieData} dashboardLoading={loading} />
      </div>
      <div className="col-span-1 p-5 border border-gray-100 rounded-xl bg-amber-500">
        <ChartBoxComputer
          dashboardData={chartDataComputer}
          dashboardWeeklyComputers={weeklyComputers}
          dashboardComputerPercent={computerPercent}
          dashboardLoading={loading}
        />
      </div>
      <div className="col-span-1 p-5 bg-blue-500 border border-gray-100 rounded-xl">
        <ChartBoxRemark
          dashboardData={chartDataRemark}
          dashboardWeeklyRemarks={weeklyRemarksBox}
          dashboardRemarkPercent={remarkPercent}
          dashboardLoading={loading}
        />
      </div>
      <div className="col-span-1 row-span-1 p-5 bg-blue-100 border border-gray-100 md:col-span-2 lg:col-span-2 md:row-span-2 rounded-xl">
        <BigChartBox dashboardData={analyticsData} dashboardLoading={loading} />
      </div>
      <div className="col-span-1 p-5 bg-blue-100 border border-gray-100 rounded-xl">
        {loading ? (
          <p className="mt-20 text-center">
            <strong>Loading...</strong>
          </p>
        ) : (
          <BarChartBox
            title="Weekly Remarks"
            dataKey="Remarks"
            color="#ff8042"
            chartData={weeklyRemarks}
            hasData={hasData}
          />
        )}
      </div>
      <div className="col-span-1 p-5 bg-blue-100 border border-gray-100 rounded-xl">
        {loading ? (
          <p className="mt-20 text-center">
            <strong>Loading...</strong>
          </p>
        ) : (
          <BarChartBoxLog
            title="Weekly Logs"
            dataKey="Logs"
            color="#341854"
            chartData={weeklyLogs}
            hasLogData={hasLogData}
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;

import React from "react";
import { Doughnut } from "react-chartjs-2";
import currencyFormatter from "currency-formatter";
import Typography from "@material-ui/core/Typography";

const PortfolioDonutChart = ({
  sum,
  balances,
  currency,
  setCurrency,
  symbol,
}) => {
  const chartData = {
    labels: balances.map(({ name }) => name),
    datasets: [
      {
        label: "# of Votes",
        data: balances.map(({ value }) => value),
        backgroundColor: balances.map(({ symbol }, index) => {
          let opacity = 0.5;
          if (symbol === currency.symbol) {
            opacity = 1;
          }
          return [
            "#FDF61B",
            "#4F11E9",
            "#F57740",
            "#FDF61B",
            "#4F11E9",
            "#F57740",
          ][index % 6];
          /* return [
            `rgba(255, 99, 132, ${opacity})`,
            `rgba(54, 162, 235, ${opacity})`,
            `rgba(255, 206, 86, ${opacity})`,
            `rgba(75, 192, 192, ${opacity})`,
            `rgba(153, 102, 255, ${opacity})`,
            `rgba(255, 159, 64, ${opacity})`,
          ][index % 6]; */
        }),
        borderColor: ["transparent"],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    animation: {
      duration: 0,
    },
    cutout: "70%",
    plugins: {
      legend: {
        display: false,
      },
    },
    onClick: (evt, item) => {
      //event code goes here
      const { id, name, symbol, price } = balances[item[0].index];
      console.log({ id, name, symbol, price });
      setCurrency({ id, name, symbol, price });
    },
  };
  const dountSize = 200;
  return (
    <div className="donut-chart">
      <div className="donut-wrapper">
        <div className="info">
          <Typography variant="h5" component="h6">
            {currencyFormatter.format(sum, {
              locale: "en-US",
              format: `${symbol}%v`,
            })}
          </Typography>
        </div>
        <Doughnut
          data={chartData}
          options={chartOptions}
          className="donut"
          style={{ maxWidth: dountSize, maxHeight: dountSize }}
        />
        <div />
      </div>
      <div className="legend">
        {balances.map(({ id, name, price, value, symbol }, index) => {
          let opacity = 0.5;
          if (symbol === currency.symbol) {
            opacity = 1;
          }
          const backgroundColor = [
            "#FDF61B",
            "#4F11E9",
            "#F57740",
            "#FDF61B",
            "#4F11E9",
            "#F57740",
          ][index % 6];
          const borderColor = "transparent";
          return (
            <div
              className={`legend-item ${
                symbol === currency.symbol ? "active" : ""
              }`}
              key={id}
              onClick={() => setCurrency({ id, name, symbol, price })}
              title={value}
            >
              <div>
                <span
                  className="legend-bg"
                  style={{ backgroundColor, borderColor }}
                />
                <Typography>{symbol}</Typography>
              </div>
              <div>{((value * 100) / sum).toFixed(2)}%</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PortfolioDonutChart;

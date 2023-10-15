import {
    ApexDataLabels,
    ApexFill,
    ApexLegend,
    ApexPlotOptions,
    ApexStroke,
    ApexXAxis,
    ApexYAxis,
  } from 'ng-apexcharts';
  
  import {
    ApexNonAxisChartSeries,
    ApexResponsive,
    ApexChart,
    ApexTheme,
    ApexTitleSubtitle,
  } from 'ng-apexcharts';

export type ChartOptions = {
    series: any | ApexNonAxisChartSeries;
    chart: any | ApexChart;
    responsive: any | ApexResponsive[];
    labels: any;
    theme: any | ApexTheme;
    title: any | ApexTitleSubtitle;
    legend: any | ApexLegend;
    fill: any | ApexFill;
    colors: any;
    xaxis: any | ApexXAxis;
    yaxis: any | ApexYAxis | ApexYAxis[];
    stroke: any | ApexStroke;
    plotOptions: any | ApexPlotOptions;
    dataLabels: any | ApexDataLabels;
  
};

export let radialChart: Partial<ChartOptions> = {
    series: [],
    chart: {
        height: 240,
        offsetY: 15,

      type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            startAngle: -100,
            endAngle: 100,
            dataLabels: {
                show: true,
                name: {
                  show: false,
                },
                value: {
                  show: true,
                  fontWeight: 600,
                  color: "#5CCB87",
                    fontSize: "2rem",
                    offsetY: 0,
                },
              },
        hollow: {
          size: '70%',
          height: 100
            },
      },
    },
    fill: {
        type: "gradient",
        gradient: {
        shade: "dark",
        type: "vertical",
        gradientToColors: ["#05E996"],
        stops: [0, 100]
        }
    },
    stroke: {
        lineCap: "round"
    },
    labels: [],
  };
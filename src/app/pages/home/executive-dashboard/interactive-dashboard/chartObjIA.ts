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

const backgroundColor: any[] = [
  '#0c4876',
  '#608fb7',
  '#C0DBEA',
  '#E8A0BF',
  '#B08BBB',
  '#9EA1D4',
  '#A8D1D1',
  '#57838d',
];
    
export const barColors = [
  '#70a6a6',
  '#608fb7',
  '#B08BBB',
  
];
export let barChart: Partial<ChartOptions> = {
    series: [],
    chart: {
        width: '100%',
        height: '300px',
        type: 'bar',
        redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
            dataLabels: {
                orientation: 'vertical',
            }
        }
    },
    labels: [],
    title: {
      text: '',
      align: 'left',
    },
    yaxis: {
      title: {
        text: '',
        style: {
          fontWeight: 500,
        }
      },
    },
    colors: backgroundColor,
};


  
export let lineBarChart: Partial<ChartOptions> = {
    series: [],
    chart: {
        width: '100%',
        height: '400px',
        type: 'line',
        redrawOnParentResize: true,
      redrawOnWindowResize: true,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: false,
          zoom: false,
          zoomin: false,
          zoomout: false,
          pan: false,
          reset: false
        }
      }
    },
    stroke: {
      width: [4, 0, 0],
      curve: 'smooth',
  },
    dataLabels: {
      enabled: true,
      background: {
        borderWidth: 0,
        opacity: 0.7,
      }
      // enabledOnSeries: [0]
    },
    plotOptions: {
      bar: {
        dataLabels: {
              position:'center',
              orientation: 'vertical',
            }
        }
    },
    labels: [],
    title: {
      text: '',
      align: 'left',
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#70a6a6',
        },
        labels: {
          style: {
            colors: '#70a6a6',
          },
        },
        title: {
          text: 'Total people in current period',
          style: {
            color: '#70a6a6',
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        seriesName: 'Join',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#175e9c',
        },
        labels: {
          style: {
            colors: '#175e9c',
          },
        },
        title: {
          text: 'No. of people',
          style: {
            color: '#175e9c',
          },
        },
        tooltip: {
          enabled: true,
        },
        // tickAmount: 4,
      },{
        seriesName: 'Join',
        show: false
      }
    ],
    colors: barColors,
  };
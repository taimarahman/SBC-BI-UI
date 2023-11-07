import {
  ApexDataLabels,
  ApexFill,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexXAxis,
  ApexYAxis,
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
  '#0c4876',
  '#E8A0BF',
  '#70a6a6',
  ]
export const donutChart: Partial<ChartOptions> = {
  series: [],
  chart: {
    width: '100%',
    type: 'donut',
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
  },
  labels: [],
  title: {
    text: 'Area-wise Claim Summary',
    align: 'center',
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          show: false,
        },
      },
    },
  ],
  colors: backgroundColor,
  fill: {
    opacity: 0.5,
  },
  plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              show: true
            },
            value: {
              show: true,
              formatter: (val: any) => {
                return ;
              }
            },
            total: {
              show: true,
              showAlways: false,
              formatter: (w:any) => {
                return w.globals.seriesTotals.reduce((a: any, b: any) => {
                  return a + b
                }, 0)
              }
            }
          }
        }
      }
},
legend: {
  position: 'right',
  horizontalAlign: 'center', 
  itemMargin: {
    horizontal: 1,
    vertical: 0
},
}
};

export const lineChart: Partial<ChartOptions> = {
  series: [],
  chart: {
    width: '100%',
    height: '300px',
    type: 'line',
    redrawOnParentResize: true,

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
  dataLabels: {
    enabled: true,
    background: {
      borderWidth: 0,
    }
  },
  stroke: {
    curve: 'smooth'
  },
  title: {
    text:'',
  },
  labels: [],
  yaxis: [
    {
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
        text: 'No. of Claims (in thousands)',
        style: {
          color: '#175e9c',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
    {
      seriesName: 'Amount',
      opposite: true,
      axisTicks: {
        show: true,
      },
      axisBorder: {
        show: true,
        color: '#ca3374',
      },
      labels: {
        style: {
          colors: '#ca3374',
        },
      },
      title: {
        text: 'Paid Amount (in crore)',
        style: {
          color: '#ca3374',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  ],

  colors: barColors,
};

import { ChartData } from 'chart.js';
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
]
const barBgColor: any[] = [ '#e77f67', '#574b90','#cf6a87', '#3dc1d3']

export const claimPieChart: Partial<ChartOptions> = {
    series: [],
    chart: {
      width: '100%',
      type: 'pie',
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
            position: 'bottom',
          },
        },
      },
    ],
    colors: backgroundColor,
    fill: {
      opacity: 0.5,
  },
  legend: {
    position: 'bottom',
  }
};
export const claimDonutChart: Partial<ChartOptions> = {
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
  

export let highestClaimBarChart: Partial<ChartOptions> = {
    series: [
      {
        name: 'Claim Amount',
        type: 'column',
        data: [],
      },
      {
        name: 'Premium Amount',
        type: 'column',
        data: [],
      },
    ],
    chart: {
      width: '100%',
      height: '256px',
      type: 'bar',
      redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
        columnWidth: '70%',
      }
    },
    labels: [],
    title: {
      text: 'Area-wise Claim Summary',
      align: 'center',
    },
    stroke: {
      width: [1, 1]
    },
    xaxis: {
      categories: [],
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#008FFB',
        },
        labels: {
          style: {
            colors: '#008FFB',
          },
        },
        title: {
          text: 'Claim Amount',
          style: {
            color: '#008FFB',
          },
          
        },
        
        tooltip: {
          enabled: true,
        },
      },
      {
        seriesName: 'Premium',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: '#00E396',
        },
        labels: {
          style: {
            colors: '#00E396',
          },
        },
        title: {
          text: 'Premium Amount',
          style: {
            color: '#00E396',
          },
        },
      },
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    colors: backgroundColor,
    fill: {
      opacity: 0.5,
    },
};
  

export let accidentBarChart: Partial<ChartOptions> = {
    series: [
        {
            name: 'Total Claim Amount',
            type: 'column',
            data: [],
        },
        {
            name: 'No. of Accidents',
            type: 'column',
            data: [],
        },
    ],
    chart: {
        width: '100%',
        height: '300px',
        type: 'bar',
        redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
            columnWidth: '80%',
            dataLabels: {
                orientation: 'vertical',
            }
        }
    },
    labels: [],
    dataLabels: {
        style: {
            fontWeight: 'semibold',
            // colors: ['#333', '#999']
        },
    },
    title: {
      text: 'Accident Summary',
      align: 'center',
    },
    stroke: {
      width: [1, 1]
    },
    xaxis: {
      categories: [],
    },
    yaxis: [
      {
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: barBgColor[0],
        },
        labels: {
          style: {
            colors: barBgColor[0],
          },
        },
        title: {
          text: 'Total Claim Amount',
          style: {
            color: barBgColor[0],
          },
          
        },
        tooltip: {
          enabled: true,
        },
      },
      {
        seriesName: 'No. of Accidents',
        opposite: true,
        axisTicks: {
          show: true,
        },
        axisBorder: {
          show: true,
          color: barBgColor[1],
        },
        labels: {
          style: {
            colors: barBgColor[1],
          },
        },
        title: {
          text: 'No. of Accidents',
          style: {
            color: barBgColor[1],
          },
        },
      },
    ],
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      },
    ],
    colors: barBgColor,
    fill: {
        opacity: 0.5,
    },
};
  

export let doughnutChartData: ChartData = {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
    datasets: [
      {
        data: [10, 20, 30, 40, 50, 60, 70],
        backgroundColor: [
          '#74b9ff',
          '#00cec9',
          '#ffeaa7',
          '#ff7675',
          '#8c7ae6',
        ],
        hoverOffset: 4
      },
      {
        data: [10, 20, 30, 40, 50, 60, 70],
        backgroundColor: [
          '#74b9ff',
          '#00cec9',
          '#ffeaa7',
          '#ff7675',
          '#8c7ae6',
        ],
        hoverOffset: 4
      },
    ],
};
  


export const shortDonutChart: Partial<ChartOptions> = {
  series: [],
  chart: {
    width: '100%',
    type: 'donut',
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
   
  },
  labels: [],
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
              show: false
            },
            value: {
              show: true,
              formatter: (val: any) => {
                return  val ;
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

export let dynamicBarChart: Partial<ChartOptions> = {
  series: [{
    name: '',
    data: []
  }],
  chart: {
      width: '100%',
      height: '300px',
      type: 'bar',
      redrawOnParentResize: true,
  },
  plotOptions: {
    bar: {
          // columnWidth: '80%',
          dataLabels: {
              orientation: 'vertical',
          }
      }
  },
  labels: [],
  dataLabels: {
      style: {
          fontWeight: 'semibold',
      },
  },
  title: {
    text: '',
    align: 'left',
  },
  stroke: {
    width: [1, 1]
  },
  xaxis: {
    categories: [],
  },
  yaxis: {
    title: {
      text: '',
    },
  },
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200,
        },
        legend: {
          position: 'bottom',
        },
      },
    },
  ],
  colors: barBgColor,
  fill: {
      opacity: 0.5,
  },
};

export const lineChart: Partial<ChartOptions> = {
  series: [],
  chart: {
    width: '100%',
    height: '250px',
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
  xaxis: {
    type: 'datetime',
  },
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
        text: 'Sold Insurance',
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
        text: 'Premium Collection',
        style: {
          color: '#ca3374',
        },
      },
      tooltip: {
        enabled: true,
      },
    },
  ],
  
  colors: barBgColor,
};

export const salesLineChart: Partial<ChartOptions> = {
  series: [],
  chart: {
    width: '100%',
    height: '280px',
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
  xaxis: {
    type: 'datetime',
  },
  yaxis: {
    axisTicks: {
      show: true,
    },
    axisBorder: {
      show: true,
    },
    title: {
      text: '',
      
    },
    tooltip: {
      enabled: true,
    },
  },
  
  // colors: barBgColor,
};
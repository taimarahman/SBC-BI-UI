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
  
    
  ]
export let barChart: Partial<ChartOptions> = {
    series: [],
    chart: {
        width: '100%',
        height: '300px',
        type: 'bar',
      redrawOnParentResize: true,
      events: {
        dataPointSelection: (event:any, chartContext:any, config:any) => { 
            console.log(config.w.config.labels[config.dataPointIndex])}
        }
    },
    plotOptions: {
      bar: {
            columnWidth: '80%',
        dataLabels: {
             
          orientation: 'vertical',
          total: {
            enabled: false,
          },
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
      tooltip: {
        enabled: true,
      },
  },
    
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          
        },
      },
    ],
    colors: backgroundColor,
    fill: {
        opacity: 0.5,
    },
};
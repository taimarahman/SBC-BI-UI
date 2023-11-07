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
        height: '400px',
        type: 'bar',
        redrawOnParentResize: true,
    },
    plotOptions: {
      bar: {
            columnWidth: '90%',
        }
    },
    labels: [],
  dataLabels: {
      enabled: false,
        style: {
          fontWeight: 'semibold',
          colors: ['#333', '#000'],
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
  

// PIE CHART
export const pieChart: Partial<ChartOptions> = {
  series: [],
  chart: {
    width: '100%',
    type: 'pie',
    redrawOnParentResize: true,
    redrawOnWindowResize: true,
   
  },
  labels: [],
  title: {
    text: '',
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
    show: false,
  position: 'right',
}
};
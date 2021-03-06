import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import sp500data from '../sp500.json'
import cpi from '../inflation-us.json'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  BarChart,
  CanvasRenderer,
  LineChart,
])

const sp500cleanedData = sp500data
  .filter((row) => new Date(row['Data']) > new Date('1970-01'))
  .slice(0, -3)
  .map((row, index) => {
    return {
      name: row['Data'].substring(0, 7),
      value: [new Date(row['Data'].substring(0, 7)), row['Zamkniecie']],
    }
  })
  .slice(13)

const monthlyYearToYearCpi = cpi.map((cpi, index, arr) => {
  return {
    ...cpi,
    value: Math.round((cpi.value / arr[index - 13]?.value - 1) * 1000) / 10,
  }
})

const data = monthlyYearToYearCpi
  .map((cpi) => {
    return {
      name: cpi.date,
      value: [cpi.date, cpi.value],
    }
  })
  .slice(13)

// .slice(0, -400)

const option = {
  xAxis: {
    type: 'time',
    data: cpi.map((cpi) => cpi.date),
  },
  yAxis: [
    {
      type: 'value',
      name: 'Inflation',
      axisLabel: {
        formatter: '{value} %',
      },
      min: -3,
      max: 17,
      interval: 2,
    },
    {
      type: 'value',
      name: 'S&P500',
      interval: 500,
    },
  ],
  tooltip: {
    trigger: 'axis',
  },
  series: [
    {
      data,
      type: 'line',
      showSymbol: false,
      tooltip: {
        valueFormatter: function (value) {
          return value + ' %'
        },
      },
    },
    {
      data: sp500cleanedData,
      type: 'line',
      showSymbol: false,
      yAxisIndex: 1,
    },
  ],
}

const onChartReadyCallback = () => {
  console.log(111)
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>

        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: '500px', width: '100%' }}
          notMerge={true}
          lazyUpdate={true}
          theme={'theme_name'}
          onChartReady={onChartReadyCallback}
          // onEvents={EventsDict}
        />
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

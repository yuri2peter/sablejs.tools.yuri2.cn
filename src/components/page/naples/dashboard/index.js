import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import styles from './index.module.scss';

dayjs.extend(relativeTime);

const Item = ({ name, content }) => (
  <div className={styles.item}>
    <div className={styles.name}>{name}</div>
    <div className={styles.content}>{content}</div>
  </div>
);

export default function Index({
  basicData: {
    serverStartTime,
    numPages,
    numAPIs,
    cpuCores,
    platform,
    totalMem,
  },
  performanceData: { cpuUsage, freememPercentage, loadAvg5 },
}) {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1 className={styles.title}>Dashboard</h1>
        <Item
          name={'CPU Usage'}
          content={cpuUsage ? (cpuUsage * 100).toFixed(2) + ' %' : 'N/A'}
        />
        <Item
          name={'Memory Usage'}
          content={
            freememPercentage
              ? (100 - freememPercentage * 100).toFixed(2) + ' %'
              : 'N/A'
          }
        />
        <Item
          name={'Load Average in 5 minutes'}
          content={loadAvg5 ? (loadAvg5 * 100).toFixed(2) + ' %' : 'N/A'}
        />
        <br />
        <Item
          name={'Running Duration'}
          content={serverStartTime ? dayjs(serverStartTime).toNow(true) : 'N/A'}
        />
        <Item
          name={'Server Start Time'}
          content={
            serverStartTime
              ? dayjs(serverStartTime).format('YYYY/MM/DD, H:mm')
              : '/N/A'
          }
        />

        <br />
        <Item name={'System Platform'} content={platform || 'N/A'} />
        <Item name={'CPU Cores'} content={cpuCores || 'N/A'} />
        <Item
          name={'Total Memory'}
          content={totalMem ? (totalMem / 1024).toFixed(1) + ' GB' : 'N/A'}
        />
        <br />
        <Item name={'Number of Pages'} content={numPages || 'N/A'} />
        <Item name={'Number of APIs'} content={numAPIs || 'N/A'} />
      </main>
    </div>
  );
}

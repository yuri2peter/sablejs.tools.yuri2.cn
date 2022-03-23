import dayjs from 'dayjs';

/**
 * This file is generated automatically by naples scaffolding.
 * @create $TIME
 * @author $AUTHOR
 */
export default function templateFileMessageText(author = '') {
  const now = dayjs().format('MMMM Do YYYY, h:mm:ss a');
  return (
    '/**\n' +
    ' * This file is generated automatically by naples scaffolding.\n' +
    ` * @create ${now}\n` +
    (author ? ` * @author ${author}\n` : '') +
    ' */\n\n'
  );
}

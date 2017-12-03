import watch from './watch';
import serve from './serve';
import build from './build';

export default function () {
  return {
    watch,
    build,
    serve,
  };
}

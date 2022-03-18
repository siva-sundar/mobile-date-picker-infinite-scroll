import {
  useEffect,
  useLayoutEffect,
  useReducer,
  useRef,
  useState
} from 'react';
import styles from './styles.module.css';
import cn from 'classnames';
const minDate = new Date('2022-1-1');
const maxDate = new Date('2022-12-31');

const customDate = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

const computeList = (selectedDate) => {
  let start = -15;
  const end = 15;
  const list = [];
  const month = selectedDate.getMonth();
  const date = selectedDate.getDate();
  const year = selectedDate.getFullYear();

  while (start <= end) {
    list.push(new Date(year, month, date + start));
    start++;
  }

  return {
    selectedDate,
    startDate: new Date(year, month, date + start),
    list,
    topHeight:
      Math.round((selectedDate - minDate) / (60 * 60 * 24 * 1000)) * 40,
    bottomHeight:
      Math.round((maxDate - selectedDate) / (60 * 60 * 24 * 1000)) * 40
  };
};

const reducer = (state, action) => {
  const { startDate, list: prevList } = state;
  const { type, currentSelection, offset } = action;
  let start, end;
  let _list;

  if (type === 'scrollDown') {
    start = offset;
    end = offset + 15;
    _list = prevList.slice(offset - 15);
    startDate = _list[0];
  } else {
    start = offset - 30;
    end = 0;
    _list = prevList.slice(0, offset);
    // startDate =
  }
  const list = [];
  const month = startDate.getMonth();
  const date = startDate.getDate();
  const year = startDate.getFullYear();

  while (start <= end) {
    list.push(new Date(year, month, date + start));
    start++;
  }

  return {
    selectedDate: currentSelection,
    startDate,
    list:
      action.type === 'scrollDown' ? [..._list, ...list] : [...list, ..._list],
    topHeight: Math.round((startDate - minDate) / (60 * 60 * 24 * 1000)) * 40,
    bottomHeight:
      Math.round((maxDate - selectedDate) / (60 * 60 * 24 * 1000)) * 40
  };
};

export default function App() {
  const [state, dispatch] = useReducer(reducer, computeList(customDate()));

  const ref = useRef();

  useLayoutEffect(() => {
    console.log(ref.current.scrollTo, ref.current.scrollHeight);
    ref.current.scrollTo(0, state.topHeight + 15 * 40);
  }, []);

  const handleScroll = ({ target: { scrollTop } }) => {
    const topOffsetHeight = scrollTop - state.topHeight;

    console.log(topOffsetHeight);
    if (topOffsetHeight > 24 * 40) {
      const offset = Math.round(topOffsetHeight / 40);

      dispatch({
        offset,
        type: 'scrollDown'
      });
      // } else if (topOffsetHeight < 4 * 40) {
      // const offset = Math.round(topOffsetHeight / 40);
      // const currentSelection = new Date(state.selectedDate);
      // currentSelection.setDate(state.startDate.getDate() + offset);
      // console.log(currentSelection.getDate());
      // dispatch({
      //   currentSelection,
      //   offset,
      //   type: 'scrollUp'
      // });
    }
  };

  return (
    <div className={styles.App}>
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
      <div
        id="cont"
        className={styles.scrollContainer}
        ref={ref}
        onScroll={(e) =>
          window.requestAnimationFrame(() => handleScroll(e.nativeEvent))
        }
      >
        <div style={{ height: `${state.topHeight + 40}px` }} />
        {state.list.map((num) => (
          <div
            className={cn(styles.item, {
              [styles.selectedDate]: num === state.selectedDateString
            })}
            // key={num}
          >
            {num.toLocaleDateString('en-IN')}
          </div>
        ))}
        <div style={{ height: `${state.bottomHeight + 40}px` }} />
      </div>
    </div>
  );
}

import { RefreshIntervals } from "./Constants";
import React from "react";
import CircleStatus from "./components/CircleStatus/CircleStatus";
import TravisStatus from "./components/TravisStatus/TravisStatus";
import "./App.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      secondsUntilNextReload: RefreshIntervals.PAGE / 1000
    };
  }

  componentDidMount() {
    setTimeout(
      "window.location.href=window.location.href;",
      RefreshIntervals.PAGE
    );

    this.tick();
    this.timerID = setInterval(() => this.tick(), 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this.setState(prevState => ({
      secondsUntilNextReload: prevState.secondsUntilNextReload - 1
    }));
  }

  render() {
    const circle = process.env.REACT_APP_ENABLE_CIRCLE ? (
      <CircleStatus />
    ) : null;
    const travis = process.env.REACT_APP_ENABLE_TRAVIS ? (
      <TravisStatus />
    ) : null;
    return (
      <div className="App">
        {circle}
        {travis}
        <br />
        <small>
          Build status is updated every {RefreshIntervals.STATUS / 1000}{" "}
          seconds.
        </small>
        <br />
        <small>
          Forcing page reload in {this.state.secondsUntilNextReload} second
          {this.state.secondsUntilNextReload > 1 ? "s" : ""}
          .
        </small>
      </div>
    );
  }
}

export default App;

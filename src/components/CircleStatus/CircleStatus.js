import { RefreshIntervals, RepositoryInfo } from "../../Constants";
import React from "react";
import StatusBadge from "../StatusBadge/StatusBadge";
import BuildChart from "../BuildChart/BuildChart";
import "whatwg-fetch";
import "./CircleStatus.css";
import Spinner from "react-spinkit";

class CircleStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      builds: [],
      date: new Date(),
      isLoading: true
    };
  }

  componentDidMount() {
    this.tick();
    this.timerID = setInterval(() => this.tick(), RefreshIntervals.STATUS);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this._fetchBuilds();
  }

  _fetchBuilds() {
    this.setState({ isLoading: true });

    const builds_url = `https://circleci.com/api/v1.1/project/github/${
      RepositoryInfo.GITHUB_ORG
    }/${RepositoryInfo.REPO}/tree/master?limit=6`; // 6 is the current number of jobs in the `tests` workflow

    fetch(builds_url, {
      headers: {
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(json => json.reverse())
      .then(recentBuilds => {
        let builds = recentBuilds.filter(build => {
          if (build.workflows) {
            console.log(build.workflows);
            if (build.workflows.workflow_name === "tests") {
              return true;
            }

            return false;
          } else {
            return true;
          }
        });
        this.setState({
          builds,
          date: new Date(),
          isLoading: false,
          latestBuild: builds[builds.length - 1]
        });
        this.forceUpdate();
      })
      .catch(ex => {
        console.log("Unable to obtain builds", ex);
      });
  }

  render() {
    const loadingIndicator = this.state.isLoading ? (
      <Spinner spinnerName="double-bounce" noFadeIn />
    ) : (
      ""
    );
    const badgeUrl = `https://circleci.com/gh/${RepositoryInfo.GITHUB_ORG}/${
      RepositoryInfo.REPO
    }.svg?style=shield`;
    const statusUrl = `http://circleci.com/gh/${RepositoryInfo.GITHUB_ORG}/${
      RepositoryInfo.REPO
    }/tree/master`;
    return (
      <div className="status">
        Latest build:{" "}
        {this.state.latestBuild ? this.state.latestBuild.build_num : "none"}
        <StatusBadge
          name="Circle"
          badgeUrl={badgeUrl}
          statusUrl={statusUrl}
          date={this.state.date}
        />
        <BuildChart builds={this.state.builds} />
        {loadingIndicator}
      </div>
    );
  }
}

export default CircleStatus;

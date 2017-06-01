import {
  CircleLifecycles,
  RefreshIntervals,
  RepositoryInfo,
} from '../../Constants';
import React from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import BuildChart from '../BuildChart/BuildChart';
import 'whatwg-fetch';
import './TravisStatus.css';
import Spinner from 'react-spinkit';

class TravisStatus extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      builds: [],
      date: new Date(),
      isLoading: true,
    };
  }

  componentDidMount() {
    this.tick();
    this.timerID = setInterval(
      () => this.tick(),
      RefreshIntervals.STATUS
    );
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  tick() {
    this._fetchBuilds();
  }

  _fetchBuilds() {
    this.setState({ isLoading: true });

    const builds_url = `https://api.travis-ci.org/repos/${RepositoryInfo.GITHUB_ORG}/${RepositoryInfo.REPO}/builds?branch=master`;

    fetch(builds_url, {
      headers: {
        Accept: 'application/vnd.travis-ci.2+json',
      },
    })
      .then(response => response.json())
      .then(json =>
        json.builds
          .filter(build => {
            return !build.pull_request;
          })
          .map(build => {
            return {
              build_num: build.number,
              build_url: `https://travis-ci.org/${RepositoryInfo.GITHUB_ORG}/${RepositoryInfo.REPO}/builds/${build.id}`,
              lifecycle: build.finished_at
                ? CircleLifecycles.FINISHED
                : '',
              status: build.state,
              subject: 'Commit ' + build.commit_id,
            };
          })
          .reverse())
      .then(builds => {
        this.setState({
          builds,
          date: new Date(),
          isLoading: false,
        });
        this.forceUpdate();
      })
      .catch(ex => {
        console.log('Unable to obtain builds', ex);
      });
  }

  render() {
    const loadingIndicator = this.state.isLoading
      ? <Spinner spinnerName="double-bounce" noFadeIn />
      : '';
    const badgeUrl = `https://travis-ci.org/${RepositoryInfo.GITHUB_ORG}/${RepositoryInfo.REPO}.svg?branch=master`;
    const statusUrl = `https://travis-ci.org/${RepositoryInfo.GITHUB_ORG}/${RepositoryInfo.REPO}/builds`;
    return (
      <div className="status">
        <StatusBadge
          name="Travis"
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

export default TravisStatus;

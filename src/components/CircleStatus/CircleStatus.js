import {
  RefreshIntervals,
  RepositoryInfo,
} from '../../Constants';
import React from 'react';
import StatusBadge from '../StatusBadge/StatusBadge';
import BuildChart from '../BuildChart/BuildChart';
import 'whatwg-fetch';
import './CircleStatus.css';
import Spinner from 'react-spinkit';

class CircleStatus extends React.Component {
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

    const builds_url = `https://circleci.com/api/v1.1/project/github/${RepositoryInfo.GITHUB_ORG}/${RepositoryInfo.REPO}/tree/master?limit=14`; // use 14 for parity with Travis

    fetch(builds_url, {
      headers: {
        Accept: 'application/json',
      },
    })
      .then(response => response.json())
      .then(json => json.reverse())
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
    const badgeUrl = `https://circleci.com/gh/${RepositoryInfo.GITHUB_ORG}/${RepositoryInfo.REPO}.svg?style=shield`;
    const statusUrl = `http://circleci.com/gh/${RepositoryInfo.GITHUB_ORG}/${RepositoryInfo.REPO}/tree/master`;
    return (
      <div className="status">
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

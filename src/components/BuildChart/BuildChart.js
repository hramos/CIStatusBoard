import { CircleLifecycles, TravisStates } from "../../Constants";
import React from "react";
import "./BuildChart.css";

class BuildChart extends React.Component {
  _renderBuild(build) {
    if (
      build.lifecycle !== CircleLifecycles.FINISHED ||
      build.status === TravisStates.CREATED
    ) {
      return null;
    }

    return (
      <a
        key={build.build_num}
        target="_blank"
        data-tooltip={
          build.workflows ? build.workflows.job_name : build.subject
        }
        data-status=""
        className={"Test " + build.status}
        href={build.build_url}
      >
        {build.workflows ? build.workflows.job_name : build.subject}
      </a>
    );
  }

  render() {
    return (
      <div className="builds">{this.props.builds.map(this._renderBuild)}</div>
    );
  }
}

BuildChart.propTypes = {
  builds: React.PropTypes.arrayOf(
    React.PropTypes.shape({
      build_num: React.PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number
      ]),
      build_url: React.PropTypes.string,
      lifecycle: React.PropTypes.string,
      status: React.PropTypes.string,
      subject: React.PropTypes.string
    })
  )
};

export default BuildChart;

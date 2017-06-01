import React from 'react';
import './StatusBadge.css';

function StatusBadge(props) {
  return (
    <div className="status-badge">
      <h1>{props.name}</h1>
      <small>Last updated: {props.date.toLocaleTimeString()}</small>
      <a href={props.statusUrl}>
        <img
          alt={props.name}
          src={props.badgeUrl + '&' + props.date.getTime()}
          className="status-shield"
        />
      </a>
    </div>
  );
}

StatusBadge.propTypes = {
  name: React.PropTypes.string.isRequired,
  badgeUrl: React.PropTypes.string.isRequired,
  statusUrl: React.PropTypes.string.isRequired,
  date: React.PropTypes.instanceOf(Date).isRequired,
};

export default StatusBadge;

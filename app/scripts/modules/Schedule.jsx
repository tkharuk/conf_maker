'use strict';

var React = require('react');
var config = require('../config');
var utilities = require('../utilities');
var classNames = require('classnames');
var ReactIntl = require('react-intl');
var IntlMixin     = ReactIntl.IntlMixin;
var FormattedDate = ReactIntl.FormattedDate;
var FormattedTime = ReactIntl.FormattedTime;

var Schedule = React.createClass({
  getInitialState: function() {
    return {
      conferences: [],
      title: ''
    }
  },
  componentDidMount: function() {
    utilities.ajax('get', config.path.schedule, function(data) {
      var temp = JSON.parse(data);
      this.setState({
        conferences: temp.data,
        title: temp.title
        });
    }.bind(this));
  },
  render: function() {
    var conferences = this.state.conferences.map(function(conference) {
      return <Conference key={conference.name} days={conference.days} name={conference.name} />
    });
    return (
      <section id="schedule" className="page-wrap">
        <h2 className="module-header">{this.state.title}</h2>
        <div className="schedule">
          {conferences}
        </div>
      </section>
    );
  }
});

var Conference = React.createClass({
  getInitialState: function() {
    return {
      activeTable: this.props.days[0],
      activeDay: this.props.days[0].day_id,
      confIsVisible: true
    }
  },
  changeTab: function(day) {
    this.setState({
      activeTable: day,
      activeDay: day.day_id
    });
  },
  changeConfRepresent: function() {
    this.setState({confIsVisible: !this.state.confIsVisible});
  },
  render: function() {
    var days = this.props.days.map(function(day) {
      var dayIsActive = (this.state.activeDay == day.day_id);
      var liClass = classNames({
        'conference__tab--active': dayIsActive
      });
      return (
        <li onClick={this.changeTab.bind(null, day)} key={day.day_id} className={liClass}>
          <FormattedDate
            value={utilities.time(day.day_info)}
            day="numeric"
            month="long" />
        </li>
      )
    }.bind(this));

    var timetable = this.props.days.map(function(day) {
      if (day.day_id == this.state.activeDay && this.state.confIsVisible) {
        return <Timetable sessions={day.timetable} key={day.day_id} />
      }
    }.bind(this));

    //set direction of arrow
    var inputClass = classNames({
        'up-arrow': this.state.confIsVisible,
        'down-arrow': !this.state.confIsVisible
    });

    return (
      <div className="conference">
        <div className="conference__title">
          <h3>Shedule: {this.props.name}</h3>
          <input type="button" onClick={this.changeConfRepresent}
            className={inputClass}/>
        </div>
        {this.state.confIsVisible ? <ul>{days}</ul> : null}
        {timetable}
      </div>
    );
  }
});

var Timetable = React.createClass({
  getInitialState: function() {
    return {
      sessions:this.props.sessions,
      smallScreen: (window.innerWidth <= 320)
    }
  },
  componentDidMount: function() {
    window.addEventListener('resize', this.handleResize);
  },
  handleResize: function() {
    var smallScreen = 320;
    var windowWidth = window.innerWidth;
    this.setState({smallScreen: (windowWidth <= smallScreen)})
  },
  render: function() {
    var sessions = this.state.sessions.map(function(session) {
      var timeStart = utilities.time(session.time.start);
      if (session.time.end) {
        var timeEnd = utilities.time(session.time.end)
      }
      return (
        <Session key={session.article} session={session} smallScreen={this.state.smallScreen}
          start={timeStart} end={timeEnd} />
      )
    }.bind(this));
    return (
      <div className="timetable">
        {sessions}
      </div>
    );
  }
});

var Session = React.createClass({
  getInitialState: function() {
    return {
      session: this.props.session,
      isReport: this.props.session.type == 'report'
    }
  },
  changeAbout: function() {
    this.setState({isHidden:!this.state.isHidden});
  },
  componentWillReceiveProps: function() {
    this.setState({
      isHidden: this.props.smallScreen
    });
  },
  render: function() {
    var speaker = null;
    var button = null;
    var timeEnd = null;

    if (this.state.isReport) {
      speaker = (
        <span className="speaker__name">
          {this.state.session.speaker.name}
          {this.state.session.speaker.position}
        </span>
      )
    }

    var sessionClass = classNames({
      'session': true,
      'session--report': this.state.isReport,
      'session--entertainment': !this.state.isReport
    });

    var sessionInfoClass = classNames({
      'session__info': true,
      'session__info--right': !this.state.isReport
    });

    var sessionAboutClass = classNames({
      'session__about': true,
      'invisible': this.state.isHidden
    });

    var sessionButtonClass = classNames ({
      'session__button': true,
      'session__button--inactive': this.state.isHidden,
      'session__button--active': !this.state.isHidden
    });

    if (this.state.session.about) {
      button = (
        <span onClick={this.changeAbout.bind(null,this.state.session)} className= {sessionButtonClass}>
        </span>
      )
    };

    if(this.props.end) {
      timeEnd = (
        <FormattedTime
            value={this.props.end}
            hour="numeric"
            minute="numeric" />
      )
    }
    return (
      <div key={this.state.session.article}
       className={sessionClass}>
        <div className="session__time">
          <FormattedTime
            value={this.props.start}
            hour="numeric"
            minute="numeric" />
          {timeEnd}
        </div>
        <div className="session__arrangement">
          <h4 className="session__name">{this.state.session.article}</h4>
          <div className={sessionInfoClass}>
            {speaker}
            {button}
          </div>
          <div className={sessionAboutClass}>
              {this.state.session.about}
          </div>
        </div>
      </div>
    )
  }
});

module.exports = Schedule;

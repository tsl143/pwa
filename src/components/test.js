import React from 'react';
// import PropTypes from 'prop-types';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';

export const styles = {
  root: {
    zIndex: -1,
    width: '100%',
    height: '100%',
    position: 'fixed',
    top: 0,
    left: 0,
    // Remove grey highlight
    WebkitTapHighlightColor: 'transparent',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  invisible: {
    backgroundColor: 'transparent',
  },
};

function Backdrop(props) {
  const { classes, className, invisible, open, transitionDuration, ...other } = props;

  return (
    <Fade appear in={open} timeout={transitionDuration} {...other}>
      <div
        data-mui-test="Backdrop"
        className={classNames(
          classes.root,
          {
            [classes.invisible]: invisible,
          },
          className,
        )}
        aria-hidden="true"
      />
    </Fade>
  );
}

Backdrop.defaultProps = {
  invisible: false,
};

export default withStyles(styles, { name: 'MuiBackdrop' })(Backdrop);

import { Component } from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Rnd } from 'react-rnd';
import Window from '../containers/Window';
import ns from '../config/css-ns';

const StyledRnd = styled(Rnd)(({ focused, theme }) => ({
  zIndex: focused ? theme.zIndex.modal - 1 : 'auto',
}));

/**
 * Represents a work area that contains any number of windows
 * @memberof Workspace
 * @private
 */
class WorkspaceElasticWindow extends Component {
  /**
   */
  render() {
    const {
      companionWindowDimensions,
      focused,
      focusWindow,
      layout,
      workspace,
      updateElasticWindowLayout,
    } = this.props;

    const offsetX = workspace.width / 2;
    const offsetY = workspace.height / 2;

    return (
      <StyledRnd
        focused={focused}
        key={`${layout.windowId}-${workspace.id}`}
        size={{
          height: layout.height + companionWindowDimensions.height,
          width: layout.width + companionWindowDimensions.width,
        }}
        position={{ x: layout.x + offsetX, y: layout.y + offsetY }}
        bounds="parent"
        onDragStop={(e, d) => {
          updateElasticWindowLayout(
            layout.windowId,
            { x: d.x - offsetX, y: d.y - offsetY },
          );
        }}
        onDragStart={focusWindow}
        onResize={(e, direction, ref, delta, position) => {
          updateElasticWindowLayout(layout.windowId, {
            height: Number.parseInt(ref.style.height, 10) - companionWindowDimensions.height,
            width: Number.parseInt(ref.style.width, 10) - companionWindowDimensions.width,
            x: position.x - offsetX,
            y: position.y - offsetY,
          });
        }}
        dragHandleClassName={ns('window-top-bar')}
        cancel={`.${ns('window-menu-btn')}`}
      >
        <Window
          windowId={layout.windowId}
        />
      </StyledRnd>
    );
  }
}

WorkspaceElasticWindow.propTypes = {
  companionWindowDimensions: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number,
  }),
  focused: PropTypes.bool,
  focusWindow: PropTypes.func,
  layout: PropTypes.shape({
    height: PropTypes.number,
    id: PropTypes.string,
    width: PropTypes.number,
    windowId: PropTypes.string,
    x: PropTypes.number,
    y: PropTypes.number,
  }).isRequired,
  updateElasticWindowLayout: PropTypes.func.isRequired,
  workspace: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

WorkspaceElasticWindow.defaultProps = {
  companionWindowDimensions: { height: 0, width: 0 },
  focused: false,
  focusWindow: () => {},
};

export default WorkspaceElasticWindow;

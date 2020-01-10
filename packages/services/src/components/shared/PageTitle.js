import { compose, withProps } from 'recompose';
import { connect } from '../../redux/store';
import { PageTitle as CommonPageTitle, selectCurrentKapp } from 'common';

export const mapStateToProps = state => ({
  space: state.app.space || 'Home',
  kapp: selectCurrentKapp(state),
});

export const mapDispatchToProps = {};

export const PageTitle = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  ),
  withProps(props => {
    return {
      pageTitleParts: props.parts.concat([
        props.kapp && props.kapp.name,
        props.space && props.space.name,
        'kinops',
      ]),
    };
  }),
)(CommonPageTitle);

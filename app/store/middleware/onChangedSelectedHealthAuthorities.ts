import { Dispatch, Middleware, AnyAction, MiddlewareAPI } from 'redux';

const onChangedSelectedHealthAuthorities: Middleware<Dispatch> = (
  _store: MiddlewareAPI,
) => (_next: Dispatch<AnyAction>) => (_action: AnyAction): unknown => {
  return null;
};

export default onChangedSelectedHealthAuthorities;

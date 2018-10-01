# History

## v1.1.2 2018 October 1
- Fixed `PluginClass` as option not supporting plugin resolvers

## v1.1.1 2018 September 8
- Added support for logging to help debug resolution errors
- Added a fallback in case type checker provided a false negative on class testing
- Updated `typechecker` dependency from v4.5.0 to v4.6.0

## v1.1.0 2018 September 8
- Removed `isPluginClass` for `require('typechecker').isClass` as strict checking on this resulted in too many false negatives due to different baseplugin versions or locations being used between plugins and apps

## v1.0.0 2018 September 4
- Initial working release

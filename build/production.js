import {
  externals,
  inputs,
  outputs,
  plugins
} from '@feizheng/webpack-lib-kits';
import merge from 'webpack-merge';
import baseConfig from './base';

export default merge(baseConfig, {
  entry: inputs.build(),
  output: outputs.build({
    library: 'ReactList'
  }),
  devtool: 'source-map',
  externals: externals.base(),
  plugins: [
    plugins.banner(),
    plugins.clean(),
    plugins.copyStyles(),
  ]
});

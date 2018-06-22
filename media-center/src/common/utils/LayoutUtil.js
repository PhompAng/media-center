import { LayoutProvider } from 'recyclerlistview/web'

export class LayoutUtil {
  static getLayoutProvider(width, type) {
    return new LayoutProvider(
      () => {
        return 'VSEL'
      },
      (type, dim) => {
        switch (type) {
        case 'VSEL':
          dim.width = width / 6 - 0.00001;
          dim.height = 450;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
        }
      }
    )
  }
}
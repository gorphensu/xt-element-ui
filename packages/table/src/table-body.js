import { getCell, getColumnByCell, getRowIdentity } from './util';
import { hasClass, addClass, removeClass } from 'element-ui/src/utils/dom';
import ElCheckbox from 'element-ui/packages/checkbox';
import ElTooltip from 'element-ui/packages/tooltip';
import TableBodyRow from './table-body-row';
import { optimizeConfig } from './config';
import throttle from 'throttle-debounce/throttle';
import debounce from 'throttle-debounce/debounce';

export default {
  components: {
    ElCheckbox,
    ElTooltip,
    TableBodyRow
  },

  props: {
    store: {
      required: true
    },
    stripe: Boolean,
    context: {},
    layout: {
      required: true
    },
    rowClassName: [String, Function],
    rowStyle: [Object, Function],
    fixed: String,
    highlight: Boolean,
    rowHeight: Number,
    rowLineNumber: Number,
    columnWidth: Number
  },
  render2(h) {
    // let tmpFixedColumns = !this.fixed
    //   ? this.columns
    //   : this.fixed === 'right'
    //     ? this.rightFixedColumns
    //     : this.fixedColumns;
    let tmpFixedColumns = this.columns;
    if (this.rowHeight) {
      tmpFixedColumns = !this.fixed
      ? this.columns
      : this.fixed === 'right'
        ? this.rightFixedColumns
        : this.fixedColumns;
    }
    const columnsHidden = tmpFixedColumns.map((column, index) => this.isColumnHidden(index));
    if (this.table.optimizeY && this.rowHeight) {
      if (!this.columnWidth) {
        if (this.data.length > optimizeConfig.defaultVisibleRowSize) {
          this.data.slice(0, optimizeConfig.defaultVisibleRowSize).forEach(row => {
            this.store.commit('addLoadedRow', row);
          });
        }
      } else {
      }
    }
    return (
      <table
        class="el-table__body"
        cellspacing="0"
        cellpadding="0"
        border="0">
        <colgroup>
          {
            this._l(tmpFixedColumns, column =>
              <col
                name={ column.id }
                width={ column.width || column.realWidth }
                key={ column.id }
              />)
          }
        </colgroup>
        <tbody>
          {
            this._l(this.visibleData, (row, $index) =>
              [
                <tr
                    style={ [this.rowStyle ? this.getRowStyle(row, $index) : null, this.trRowHeightStyle] }
                    key={ this.table.rowKey ? this.getKeyOfRow(row, $index) : $index }
                    on-dblclick={ ($event) => this.handleDoubleClick($event, row) }
                    on-click={ ($event) => this.handleClick($event, row) }
                    on-contextmenu={ ($event) => this.handleContextMenu($event, row) }
                    on-mouseenter={ _ => this.handleMouseEnter($index) }
                    on-mouseleave={ _ => this.handleMouseLeave() }
                    class={ [this.getRowClass(row, $index)] }>
                    {
                      this._l(tmpFixedColumns, (column, cellIndex) => {
                        const { rowspan, colspan } = this.getSpan(row, column, $index, cellIndex);
                        if (!rowspan || !colspan) {
                          return null;
                        }
                        return (<td
                          rowspan={ rowspan }
                          colspan={ colspan }
                          style={this.rowHeightStyle}
                          class={ [column.id, column.align, column.className || '', columnsHidden[cellIndex] ? 'is-hidden-deprecated' : '' ] }
                          on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row) }
                          on-mouseleave={ this.handleCellMouseLeave }>
                          {
                            column.renderCell.call(this._renderProxy, h, { row, column, $index, store: this.store, _self: this.context || this.table.$vnode.context }, columnsHidden[cellIndex])
                          }
                        </td>)
                      }
                      )
                    }
                    {
                      !this.fixed && this.layout.scrollY && this.layout.gutterWidth ? <td class="gutter" /> : ''
                    }
                  </tr>,
                this.store.states.expandRows.indexOf(row) > -1
                ? (<tr>
                    <td style={this.rowHeightStyle} colspan={ tmpFixedColumns.length } class="el-table__expanded-cell">
                      { this.table.renderExpanded ? this.table.renderExpanded(h, { row, $index, store: this.store }) : ''}
                    </td>
                  </tr>)
                : ''
              ]
            ).concat(
              this._self.$parent.$slots.append
            ).concat(
              <el-tooltip effect={ this.table.tooltipEffect } placement="top" ref="tooltip" content={ this.tooltipContent }></el-tooltip>
            )
          }
        </tbody>
      </table>
    );
  },
  render(h) {
    if (!this.rowHeight || !this.table.optimizeY) {
      return this.$options.render2.call(this, h);
    }
    // let tmpFixedColumns = !this.fixed
    //   ? this.columns
    //   : this.fixed === 'right'
    //     ? this.rightFixedColumns
    //     : this.fixedColumns;
    let tmpFixedColumns = this.columns;
    if (this.rowHeight) {
      tmpFixedColumns = !this.fixed
      ? this.columns
      : this.fixed === 'right'
        ? this.rightFixedColumns
        : this.fixedColumns;
    }
    const columnsHidden = tmpFixedColumns.map((column, index) => this.isColumnHidden(index));
    if (this.table.optimizeY && this.rowHeight) {
      if (!this.columnWidth) {
        if (this.data.length > optimizeConfig.defaultVisibleRowSize) {
          this.data.slice(0, optimizeConfig.defaultVisibleRowSize).forEach(row => {
            this.store.commit('addLoadedRow', row);
          });
        }
      } else {
      }
    }
    return (
      <div
        class={['el-table__virtual-wrapper', {'el-table--fixed__virtual-wrapper': this.fixed}]}
        style={{height: this.table.virtualBodyHeight + 'px'}} >
        <div style={[{transform: `translateY(${this.innerTop}px)`}]}>
        <table
          class="el-table__body"
          cellspacing="0"
          cellpadding="0"
          border="0">
          <colgroup>
            {
              this._l(tmpFixedColumns, column =>
                <col
                  name={ column.id }
                  width={ column.width || column.realWidth }
                  key={ column.id }
                />)
            }
          </colgroup>
          <tbody>
            {
              this._l(this.visibleData, (row, $index) =>
                [
                  <tr
                    style={ [this.rowStyle ? this.getRowStyle(row, $index) : null, this.trRowHeightStyle] }
                    key={ this.table.rowKey ? this.getKeyOfRow(row, $index) : $index }
                    on-dblclick={ ($event) => this.handleDoubleClick($event, row) }
                    on-click={ ($event) => this.handleClick($event, row) }
                    on-contextmenu={ ($event) => this.handleContextMenu($event, row) }
                    on-mouseenter={ _ => this.handleMouseEnter($index) }
                    on-mouseleave={ _ => this.handleMouseLeave() }
                    class={ [this.getRowClass(row, $index)] }>
                    {
                      this._l(tmpFixedColumns, (column, cellIndex) => {
                        const { rowspan, colspan } = this.getSpan(row, column, $index, cellIndex);
                        if (!rowspan || !colspan) {
                          return null;
                        }
                        return (<td
                          style={this.rowHeightStyle}
                          class={ [column.id, column.align, column.className || '', columnsHidden[cellIndex] ? 'is-hidden' : '' ] }
                          on-mouseenter={ ($event) => this.handleCellMouseEnter($event, row) }
                          on-mouseleave={ this.handleCellMouseLeave }>
                          {
                            column.renderCell.call(this._renderProxy, h, { row, column, $index, store: this.store, _self: this.context || this.table.$vnode.context }, columnsHidden[cellIndex])
                          }
                        </td>)
                      }
                      )
                    }
                    {
                      !this.fixed && this.layout.scrollY && this.layout.gutterWidth ? <td class="gutter" /> : ''
                    }
                  </tr>,
                  this.store.states.expandRows.indexOf(row) > -1
                  ? (<tr>
                      <td style={this.rowHeightStyle} colspan={ tmpFixedColumns.length } class="el-table__expanded-cell">
                        { this.table.renderExpanded ? this.table.renderExpanded(h, { row, $index, store: this.store }) : ''}
                      </td>
                    </tr>)
                  : ''
                ]
              ).concat(
                this._self.$parent.$slots.append
              ).concat(
                <el-tooltip effect={ this.table.tooltipEffect } placement="top" ref="tooltip" content={ this.tooltipContent }></el-tooltip>
              )
            }
          </tbody>
        </table>
        </div>
      </div>
    );
  },

  watch: {
    'store.states.hoverRow'(newVal, oldVal) {
      if (!this.store.states.isComplex) return;
      const el = this.$el;
      if (!el) return;
      const rows = el.querySelectorAll('tbody > tr.el-table__row');
      const oldRow = rows[oldVal];
      const newRow = rows[newVal];
      if (oldRow) {
        removeClass(oldRow, 'hover-row');
      }
      if (newRow) {
        addClass(newRow, 'hover-row');
      }
    },
    'store.states.currentRow'(newVal, oldVal) {
      if (!this.highlight) return;
      const el = this.$el;
      if (!el) return;
      const data = this.store.states.data;
      const rows = el.querySelectorAll('tbody > tr.el-table__row');
      const oldRow = rows[data.indexOf(oldVal)];
      const newRow = rows[data.indexOf(newVal)];
      if (oldRow) {
        removeClass(oldRow, 'current-row');
      } else if (rows) {
        [].forEach.call(rows, row => removeClass(row, 'current-row'));
      }
      if (newRow) {
        addClass(newRow, 'current-row');
      }
    }
  },

  computed: {
    visibleData() {
      if (this.table.optimizeY && this.rowHeight) {
        return this.data.slice(this.startIndex, this.endIndex);
      }
      return this.data
    },
    loadedRows() {
      return this.store.states.loadedRows || []
    },
    rowHeightStyle() {
      if (!this.rowHeight) {
        return {}
      }
      if (this.rowLineNumber) {
        return {
          height: this.rowHeight + 'px'
        }
      }
      return {}
    },
    trRowHeightStyle() {
      if (!this.rowHeight) {
        return {}
      }
      return {
        height: this.rowHeight + 'px'
      }
    },
    table() {
      return this.$parent;
    },

    data() {
      return this.store.states.data;
    },

    columnsCount() {
      return this.store.states.columns.length;
    },

    leftFixedCount() {
      return this.store.states.fixedColumns.length;
    },

    rightFixedCount() {
      return this.store.states.rightFixedColumns.length;
    },

    columns() {
      return this.store.states.columns;
    },
    fixedColumns() {
      return this.store.states.fixedColumns;
    },
    rightFixedColumns() {
      return this.store.states.rightFixedColumns;
    },

    loadedRows() {
      return this.store.states.loadedRows;
    }
  },

  data() {
    return {
      tooltipContent: '',
      startIndex: 0,
      endIndex: optimizeConfig.defaultVisibleRowSize - 1,
      visibleCount: optimizeConfig.defaultVisibleRowSize,
      scrollTop: 0,
      excessRows: 3,
      innerTop: 0
    };
  },

  created() {
    this.activateTooltip = debounce(50, tooltip => tooltip.handleShowPopper());
    // this.throttleScrollEvent = debounce(50, (e) => this.scrollEvent(e));
    this.throttleScrollEvent = this.scrollEvent;
    this.visibleCount = this.table.visibleRowCount;
    this.endIndex = this.startIndex + this.visibleCount;
  },

  mounted() {
    // 行懒加载优化
    if (this.table.optimizeY && this.rowHeight) {
      this.bindEvent();
    }
  },

  beforeDestroy() {
    // 行懒加载优化
    if (this.table.optimizeY && this.rowHeight) {
      this.unbindEvent();
    }
  },

  methods: {
    getVisibleCount() {
      let bodyWrapper = this.table && this.table.bodyWrapper;
      if (bodyWrapper) {
        let scrollTop = bodyWrapper.scrollTop;
        let clientHeight = bodyWrapper.offsetHeight;
        return Math.ceil(clientHeight / this.rowHeight);
      }
      return optimizeConfig.defaultVisibleRowSize
    },
    getKeyOfRow(row, index) {
      const rowKey = this.table.rowKey;
      if (rowKey) {
        return getRowIdentity(row, rowKey);
      }
      return index;
    },
    // TODO 没用了
    isColumnHidden(index) {
      if (this.fixed === true || this.fixed === 'left') {
        return index >= this.leftFixedCount;
      } else if (this.fixed === 'right') {
        return index < this.columnsCount - this.rightFixedCount;
      } else {
        return (index < this.leftFixedCount) || (index >= this.columnsCount - this.rightFixedCount);
      }
    },

    getSpan(row, column, rowIndex, columnIndex) {
      let rowspan = 1;
      let colspan = 1;
      const fn = this.table.spanMethod;
      if (typeof fn === 'function') {
        const result = fn({
          row,
          column,
          rowIndex,
          columnIndex
        });
        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (typeof result === 'object') {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
      }
      return { rowspan, colspan };
    },

    getRowStyle(row, index) {
      const rowStyle = this.rowStyle;
      if (typeof rowStyle === 'function') {
        return rowStyle.call(null, row, index);
      }
      return rowStyle;
    },

    getRowClass(row, index) {
      const classes = ['el-table__row'];

      if (this.stripe && index % 2 === 1) {
        classes.push('el-table__row--striped');
      }
      const rowClassName = this.rowClassName;
      if (typeof rowClassName === 'string') {
        classes.push(rowClassName);
      } else if (typeof rowClassName === 'function') {
        classes.push(rowClassName.call(null, row, index) || '');
      }

      return classes.join(' ');
    },

    handleCellMouseEnter(event, row) {
      const table = this.table;
      const cell = getCell(event);

      if (cell) {
        const column = getColumnByCell(table, cell);
        const hoverState = table.hoverState = {cell, column, row};
        table.$emit('cell-mouse-enter', hoverState.row, hoverState.column, hoverState.cell, event);
      }

      // 判断是否text-overflow, 如果是就显示tooltip
      const cellChild = event.target.querySelector('.cell');

      if (hasClass(cellChild, 'el-tooltip') && cellChild.scrollWidth > cellChild.offsetWidth) {
        const tooltip = this.$refs.tooltip;

        this.tooltipContent = cell.innerText;
        tooltip.referenceElm = cell;
        tooltip.$refs.popper && (tooltip.$refs.popper.style.display = 'none');
        tooltip.doDestroy();
        tooltip.setExpectedState(true);
        this.activateTooltip(tooltip);
      }
    },

    handleCellMouseLeave(event) {
      const tooltip = this.$refs.tooltip;
      if (tooltip) {
        tooltip.setExpectedState(false);
        tooltip.handleClosePopper();
      }
      const cell = getCell(event);
      if (!cell) return;

      const oldHoverState = this.table.hoverState;
      this.table.$emit('cell-mouse-leave', oldHoverState.row, oldHoverState.column, oldHoverState.cell, event);
    },

    handleMouseEnter(index) {
      this.store.commit('setHoverRow', index);
    },

    handleMouseLeave() {
      this.store.commit('setHoverRow', null);
    },

    handleContextMenu(event, row) {
      this.handleEvent(event, row, 'contextmenu');
    },

    handleDoubleClick(event, row) {
      this.handleEvent(event, row, 'dblclick');
    },

    handleClick(event, row) {
      this.store.commit('setCurrentRow', row);
      this.handleEvent(event, row, 'click');
    },

    handleEvent(event, row, name) {
      const table = this.table;
      const cell = getCell(event);
      let column;
      if (cell) {
        column = getColumnByCell(table, cell);
        if (column) {
          table.$emit(`cell-${name}`, row, column, cell, event);
        }
      }
      table.$emit(`row-${name}`, row, event, column);
    },

    handleExpandClick(row) {
      this.store.commit('toggleRowExpanded', row);
    },
    bindEvent() {
      this.table.bodyWrapper && this.table.bodyWrapper.addEventListener('scroll', this.throttleScrollEvent, {
        passive: true
      });
    },
    unbindEvent() {
      this.table.bodyWrapper && this.table.bodyWrapper.removeEventListener('scroll', this.throttleScrollEvent);
    },
    scrollEvent2(e) {
      if (this.data.length <= this.visibleCount && (!this.columnWidth || true)) {
        return
      }
      let bodyWrapper = this.table && this.table.bodyWrapper;
      if (bodyWrapper) {
        let scrollTop = bodyWrapper.scrollTop;
        this.scrollTop = scrollTop;
        let clientHeight = bodyWrapper.offsetHeight;
        let rowHeight = this.rowHeight;
        let start = Math.floor(scrollTop / rowHeight);
        let end = start + this.visibleCount;
        if (end > this.data.length) {
          end = this.data.length;
          start = end - this.visibleCount;
        }
        this.startIndex = start;
        this.endIndex = end;
        console.log(this.startIndex, this.endIndex, this.innerTop);
      }
    },
    scrollEvent(e) {
      if (this.data.length <= this.visibleCount) {
        return
      }
      let bodyWrapper = this.table && this.table.bodyWrapper;
      if (bodyWrapper) {
        let scrollTop = bodyWrapper.scrollTop;
        const bodyScrollHeight = this.visibleCount * this.rowHeight;
        // this.scrollTop = scrollTop;
        if (this.table.virtualBodyHeight < scrollTop + bodyScrollHeight) {
          scrollTop = this.table.virtualBodyHeight - bodyScrollHeight;
        }
        this.scrollTop = scrollTop;
        let startIndex = parseInt(scrollTop / this.rowHeight);
        const { start, end } = this.getVisibleRange(startIndex)
        this.startIndex = start
        this.endIndex = end
        this.innerTop = this.startIndex * this.rowHeight
        console.log(this.startIndex, this.endIndex, this.innerTop);
      }
    },
    getVisibleRange (expectStart) {
      const start = expectStart - this.excessRows

      return {
        start: start >= 0 ? start : 0,
        end: expectStart + this.visibleCount + this.excessRows
      }
    }
  }
};

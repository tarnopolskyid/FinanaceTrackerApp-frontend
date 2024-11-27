import { Component, effect, EventEmitter, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core'
import { faEdit, faFile, faFileExcel, faFilePdf, faTrash } from '@fortawesome/free-solid-svg-icons'
import { TransactionService } from '../../services/transaction.service'
import { ITransaction } from '../../types/transaction.interface'
import { RowInput } from 'jspdf-autotable'
import { Table } from 'primeng/table'
import { ToastrService } from 'ngx-toastr'
import { format } from 'date-fns'
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-transactions-table',
  templateUrl: './transactions-table.component.html',
  styleUrl: './transactions-table.component.scss',
})
export class TransactionsTableComponent implements OnInit {

  @ViewChild('dt', { static: false })
  dt: Table | undefined;

  @Output()
  editClicked = new EventEmitter<ITransaction>();

  filePdfIcon = faFilePdf;
  fileExcelIcon = faFileExcel;
  fileIcon = faFile;
  editIcon = faEdit;
  removeIcon = faTrash;
  currentPage = 1;

  transactions: ITransaction[] = [];
  cols: any[] = [];
  exportColumns: any[] = [];

  constructor(readonly transactionService: TransactionService,
              readonly toastr: ToastrService) {
    this.transactionService.findAll();
    effect(() => {
      this.transactions = this.transactionService.transactionSig();
    });
  }

  ngOnInit(): void {
    this.cols = [
      { field: 'title', header: 'Title', customExportHeader: 'Product Code' },
      { field: 'amount', header: 'Amount' },
      { field: 'category.title', header: 'Category' },
      { field: 'createdAt', header: 'Date' },
      { field: 'comment', header: 'Comment' }
    ];

    this.exportColumns = this.cols.map(col => ({title: col.header, dataKey: col.field}));
  }

  protected delete(id: number) {
    this.transactionService.delete(id);
  }

  protected onEditClick(transaction: ITransaction) {
    this.editClicked.emit(transaction);
  }

  exportCsv() {
    if (!this.transactions || this.transactions.length === 0) {
      this.toastr.warning('No transactions available for export.');
      return;
    }
    if (this.dt) {
      const formattedTransactions = this.transactions.map(transaction => ({
        ...transaction,
        createdAt: transaction.createdAt ? format(new Date(transaction.createdAt), 'dd.MM.yyyy HH:mm:ss') : ''
      }));

      // Temporarily replace the transactions with formatted ones for export
      const originalTransactions = [...this.transactions];
      this.transactions = formattedTransactions as unknown as ITransaction[];

      setTimeout(() => {
        this.dt?.exportCSV();
        // Restore the original transactions after export
        this.transactions = originalTransactions;
      }, 0);
    } else {
      this.toastr.error('Table reference is not available.');
    }
  }

  exportPdf(): void {
    import("jspdf").then((jsPDF) => {
      import("jspdf-autotable").then(() => {
        const doc = new (jsPDF as any).default();

        const rows: RowInput[] = this.transactions.map(transaction => ({
          title: transaction.title,
          amount: transaction.amount,
          category: transaction.category?.title || 'Other',
          createdAt: transaction.createdAt ? format(new Date(transaction.createdAt), 'dd.MM.yyyy HH:mm:ss') : '',
          comment: transaction.comment
        }));

        (doc as any).autoTable({
          columns: this.exportColumns,
          body: rows
        });

        doc.save('transactions.pdf');
      });
    });
  }

  exportExcel(): void {
    import("xlsx").then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(this.transactions.map(transaction => ({
        Title: transaction.title,
        Amount: transaction.amount,
        Category: transaction.category?.title || 'Other',
        Date: transaction.createdAt ? format(new Date(transaction.createdAt), 'dd.MM.yyyy HH:mm:ss') : '',
        Comment: transaction.comment
      })));

      const workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'transactions');
    });
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const EXCEL_TYPE = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const EXCEL_EXTENSION = ".xlsx";
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, `${fileName}_export_${new Date().getTime()}${EXCEL_EXTENSION}`);
  }


}

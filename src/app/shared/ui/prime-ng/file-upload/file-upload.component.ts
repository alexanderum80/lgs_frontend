import { FormGroup } from '@angular/forms';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'png-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss'],
})
export class FileUploadComponent implements OnInit {
  @Input() public fg: FormGroup;
  @Input() public control: string;
  @Input() public label: string;
  @Input() public floatLabel = false;
  @Input() public labelWidth: string;
  @Input() public mode: 'advanced' | 'basic' = 'basic';
  @Input() public multiple = false;
  @Input() public chooseLabel = '';

  uploadedFiles: any[] = [];

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cd.detectChanges();
  }

  onUpload(event: any) {
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

    this.fg.controls[this.control].setValue(this.uploadedFiles);
  }
}

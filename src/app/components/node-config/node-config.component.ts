import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-node-config',
  templateUrl: './node-config.component.html',
  styleUrls: ['./node-config.component.css'],
})
export class NodeConfigComponent implements OnInit {
  public nodeConfigForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.nodeConfigForm = this.fb.group({
      id: this.fb.control(null, [Validators.required]),
      label: this.fb.control(null, [Validators.required]),
    });
  }

  ngOnInit(): void {}

  updateNode(){
    console.log(this.nodeConfigForm.value);
  }
}

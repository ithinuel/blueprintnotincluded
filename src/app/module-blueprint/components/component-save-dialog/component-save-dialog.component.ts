import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SaveInfo } from '../../common/save-info';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BlueprintService } from '../../common/blueprint-service';
import { Template } from '../../common/template/template';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-component-save-dialog',
  templateUrl: './component-save-dialog.component.html',
  styleUrls: ['./component-save-dialog.component.css']
})
export class ComponentSaveDialogComponent implements OnInit {

  visible: boolean = false;

  @Input() blueprint: Template;
  @Output() onSave = new EventEmitter();
  
  saveBlueprintForm = new FormGroup({
    name: new FormControl('', [Validators.required])
  });

  get f() { return this.saveBlueprintForm.controls; }
  get icon() { return this.working ? 'pi pi-spin pi-spinner' : ''; }

  working: boolean = false;
  overwrite: boolean = false;

  constructor(private blueprintService: BlueprintService, private messageService: MessageService) { }

  ngOnInit() {
  }

  onSubmit()
  {
    this.working = true;

    this.blueprint.name = this.saveBlueprintForm.value.name;
    this.blueprintService.saveBlueprint(this.blueprint, false).subscribe({
      next: this.handleSaveNext.bind(this),
      error: this.handleSaveError.bind(this)
    });
  }

  handleSaveNext(response: any)
  {
    console.log(response);
    if (response.overwrite) 
    {
      this.overwrite = true;
      this.saveBlueprintForm.controls.name.disable();
      this.working = false;
    }
    else
    {
      this.hideDialog();

      let summary: string = this.blueprint.name + ' saved';
      let detail: string = 'prout';
  
      this.messageService.add({severity:'success', summary:summary , detail:detail});
      this.working = false;
    }


  }

  handleSaveError()
  {
    
    this.working = false;
  }

  showDialog()
  {
    this.reset();
    this.visible = true;
    
    if (this.blueprint.name != null && this.blueprint.name != '') this.saveBlueprintForm.patchValue({name: this.blueprint.name});
  }

  reset()
  {
    this.working = false;
    this.overwrite = false;
    this.saveBlueprintForm.controls.name.enable();
    this.saveBlueprintForm.reset();
  }

  doNotOverwrite()
  {
    this.overwrite = false;
    this.saveBlueprintForm.controls.name.enable();
  }

  doOverwrite()
  {
    this.working = true;

    this.blueprint.name = this.saveBlueprintForm.value.name;
    this.blueprintService.saveBlueprint(this.blueprint, true).subscribe({
      next: this.handleSaveNext.bind(this),
      error: this.handleSaveError.bind(this)
    });
  }

  hideDialog()
  {
    this.visible = false;
  }

}

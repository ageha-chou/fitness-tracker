import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

@NgModule({
  imports: [FlexLayoutModule, CommonModule, MaterialModule, FormsModule],
  exports: [FlexLayoutModule, CommonModule, MaterialModule, FormsModule],
})
export class SharedModule {}

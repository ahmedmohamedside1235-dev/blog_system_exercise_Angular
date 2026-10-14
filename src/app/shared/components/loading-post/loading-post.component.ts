import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-post',
  imports: [],
  templateUrl: './loading-post.component.html',
  styleUrl: './loading-post.component.scss',
})
export class LoadingPostComponent {
  public operations = input<boolean>(false);
}

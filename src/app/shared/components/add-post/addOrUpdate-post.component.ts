import { Component, computed, DestroyRef, effect, ElementRef, inject, input, OnInit, output, signal, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { NotificationService } from '../../../core/services/notification.service';
import { NewPost } from '../../../core/models/new-post-model';

@Component({
  selector: 'app-addOrUpdate-post',
  imports: [FormsModule],
  templateUrl: './addOrUpdate-post.component.html',
  styleUrl: './addOrUpdate-post.component.scss',
})
export class AddOrUpdatePostComponent implements OnInit {

  private notificationService = inject(NotificationService);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private destroyRef = inject(DestroyRef);
  private form = viewChild.required<NgForm>('form');

  public isValidAuthor = signal<boolean>(false);
  public isValidTitle = signal<boolean>(false);
  public isValidBody = signal<boolean>(false);

  public addPost = output<NewPost>();
  public editPost = output<NewPost>();
  public modalClosed = output<boolean>();

  public isEditForm = input<boolean>(false);
  public postData = input<any>(null);

  // reset form after close madel or after destroy it 
  public ngOnInit() {
    let modal = this.host.nativeElement.closest('.modal');
    if (!modal) return;

    let onHidden = () => {
      this.resetForm(this.form());
      this.modalClosed.emit(true);
    };

    modal.addEventListener('hidden.bs.modal', onHidden);

    this.destroyRef.onDestroy(() =>
      modal.removeEventListener('hidden.bs.modal', onHidden)
    );
  }

  // check update signal 
  constructor() {
    effect(() => {
      let data = this.postData();

      //  if form is add 
      if (!this.isEditForm()) return;

      if (!data) {
        this.resetForm(this.form());
        return;
      }

      // insert values in inputs
      this.form().form.patchValue({
        author_name: data.author_name,
        title: data.title,
        body: data.body,
      });

      // validate values 
      this.checkValidation(this.form());
    });
  }

  // validate autho name input
  public validateAuthor(value: string) {
    let regex = /^[a-zA-Z]{3,}(\s+[a-zA-Z]{3,}){0,2}$/;
    if (regex.test((value ?? '').trim())) {
      this.isValidAuthor.set(true);
      return;
    }

    this.isValidAuthor.set(false);
  }

  // validate title input 
  public validateTitle(value: string) {
    let regex = /^[a-zA-Z]{3,}(\s+[a-zA-Z]{3,})*$/;
    if (regex.test((value ?? '').trim())) {
      this.isValidTitle.set(true);
      return;
    }

    this.isValidTitle.set(false);
  }

  // validate body input 
  public validateBody(value: string) {
    let text = (value ?? '').trim(),
      regex = /^[A-Za-z0-9\s.,!?'"():;-]+$/;
    this.isValidBody.set(text.length >= 10 && regex.test(text));
  }

  public bodyError(value: string | null): string {
    let text = (value ?? '').trim();
    if (!text) return 'The Body is required';
    if (text.length < 10) return 'The Body must be at least 10 characters';
    return 'The Body can contain only English letters, numbers and . , ! ? \' " ( ) : ; -';
  }


  // reset form
  public resetForm(form: NgForm) {
    this.isValidAuthor.set(false);
    this.isValidBody.set(false);
    this.isValidTitle.set(false);
    form.reset();
  }

  // check valid form inputs
  public isValidForm = computed<boolean>(() => this.isValidAuthor() && this.isValidTitle() && this.isValidBody());

  private checkValidation(form: NgForm) {
    this.validateAuthor(form.value.author_name);
    this.validateTitle(form.value.title);
    this.validateBody(form.value.body);
  }

  // add post
  public submitForm(form: NgForm, cancelBtn: HTMLButtonElement) {
    if (!this.isValidForm()) {
      this.checkValidation(form);
      return;
    }

    let post: NewPost & { id?: number } = {
      author_name: form.value.author_name.trim(),
      title: form.value.title.trim(),
      body: form.value.body.trim()
    };

    this.resetForm(form);
    cancelBtn.click();

    // if the form is Edit post
    if (this.isEditForm()) {
      let original = this.postData(),
        isSame =
          post.title === original?.title.trim() &&
          post.body === original?.body.trim() &&
          post.author_name === original?.author_name.trim();

      // check the same data in form input
      if (isSame) {
        this.notificationService.show('No changes to save', 'error');
        return;
      }

      post.id = original?.id;
      this.editPost.emit(post);
      return;
    }

    this.addPost.emit(post);
  }


}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NewPost } from '../models/new-post-model';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private http = inject(HttpClient);
  private URL_ORIGIN: string = 'http://exserciselaravel.atwebpages.com/api/post';

  public getAllPosts(isTrashed: boolean = false): Observable<any[]> {
    return this.http.post<any[]>(`${this.URL_ORIGIN}/getAll`, { trashed: isTrashed });
  }

  public addPost(post: NewPost) {
    return this.http.post(`${this.URL_ORIGIN}/create`, post);
  }

  public deletePost(postId: string) {
    return this.http.delete(`${this.URL_ORIGIN}/delete`, { body: { id: postId } });
  }

  public forceDeletedPost(postId: string) {
    return this.http.delete(`${this.URL_ORIGIN}/force_delete`, { body: { id: postId } });
  }

  public restoredPost(postId: string) {
    return this.http.post(`${this.URL_ORIGIN}/restore`, { id: postId });
  }

  public updatedPost(post: NewPost) {
    return this.http.post(`${this.URL_ORIGIN}/update`, post);
  }
  public getPost(postId: string) {
    return this.http.post(`${this.URL_ORIGIN}/getPost`, { id: postId });
  }
}

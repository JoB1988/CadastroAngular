import { Injectable } from "@angular/core";
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../app.model';

@Injectable()
export class ToastService {
    public toast$ = new BehaviorSubject<Toast>(undefined);
}

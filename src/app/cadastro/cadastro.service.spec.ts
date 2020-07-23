import { TestBed, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CadastroService } from './cadastro.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { throws } from 'assert';

const ERRORRESPONSE = new HttpErrorResponse({
  error: `error 404 test`,
  status: 404,
  statusText: `error`
});

const CADASTRO = {
  nome: 'Antonia',
  cep: '09790000',
  rua: 'Av. Albert Schweitzer',
  numero: 490
};

describe('CadastroService Success', () => {
  let httpClientSpy;
  let service: CadastroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClientSpy = jasmine.createSpyObj(`HttpClient`, [
      `post`,
      `get`,
      `put`,
      `delete`
    ]);
    service = new CadastroService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // #region Success

  it(`should test getAddress success`, () => {
    httpClientSpy.get.and.returnValue(of({}));
    service.getAddress(`fakeurl`).subscribe(response => {
      expect(response).toEqual({});
    });
  });

  it(`should test getCadastro success`, () => {
    httpClientSpy.get.and.returnValue(of({}));
    service.getCadastro(`1234`).subscribe(response => {
      expect(response).toEqual({});
    });
  });

  it(`should test saveForm success`, () => {
    httpClientSpy.post.and.returnValue(of({}));
    service
      .saveForm(CADASTRO)
      .subscribe(response => {
        expect(response).toEqual({});
      });
  });

  it(`should test updateForm success`, () => {
    httpClientSpy.put.and.returnValue(of({}));
    service
      .updateForm(CADASTRO)
      .subscribe(response => {
        expect(response).toEqual({});
      });
  });

  it(`should test delete success`, () => {
    httpClientSpy.delete.and.returnValue(of({}));
    service
      .delete(`1234`)
      .subscribe(response => {
        expect(response).toEqual({});
      });
  });

  //#endregion

});

xdescribe('CadastroService Error', () => {

  let httpClientSpy;
  let service: CadastroService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpClientSpy = jasmine.createSpyObj(`HttpClient`, [
      `post`,
      `get`,
      `put`,
      `delete`
    ]);
    service = new CadastroService(httpClientSpy as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // #region Erro Case
  it(`should test getCadastro error`, () => {
    httpClientSpy.get.and.returnValue(throwError(ERRORRESPONSE));
    service.getCadastro().subscribe(response => {
      fail('error expected');
    }),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toEqual(`test 404 error`);
      };
  });

  it(`should test getAddress error`, () => {
    httpClientSpy.get.and.returnValue(throwError(ERRORRESPONSE));
    service.getAddress(`09890430`).subscribe(response => {
      fail('error expected');
    }),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toEqual(`test 404 error`);
      };
  });

  it(`should test saveForm error`, () => {
    httpClientSpy.post.and.returnValue(throwError(ERRORRESPONSE));
    service.saveForm(CADASTRO).subscribe(response => {
      fail('error expected');
    }),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toEqual(`test 404 error`);
      };
  });

  it(`should test updateForm error`, () => {
    httpClientSpy.put.and.returnValue(throwError(ERRORRESPONSE));
    service.updateForm(CADASTRO).subscribe(response => {
      fail('error expected');
    }),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toEqual(`test 404 error`);
      };
  });

  it(`should test delete error`, () => {
    httpClientSpy.delete.and.returnValue(throwError(ERRORRESPONSE));
    service.delete(`1234`).subscribe(response => {
      fail('error expected');
    }),
      (error: HttpErrorResponse) => {
        expect(error.status).toEqual(404);
        expect(error.error).toEqual(`test 404 error`);
      };
  });

  //#endregion

})

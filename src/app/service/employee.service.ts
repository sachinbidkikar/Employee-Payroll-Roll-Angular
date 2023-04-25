import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee } from '../models/employee';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EmployeeService {



  constructor(private httpClient: HttpClient) { }

  getEmployeeData(): Observable<any> {
    return this.httpClient.get('http://localhost:8080/app/get')
  }

  getEmployeeById(id: number): Observable<any> {
    return this.httpClient.get(`http://localhost:8080/app/getById/${id}`)
  }

  addEmployeeData(body: Employee): Observable<any> {
    return this.httpClient.post('http://localhost:8080/app/post', body)
  }

  deleteEmployeeData(empId: number): Observable<any> {
    return this.httpClient.delete("http://localhost:8080/app/delete/" + empId);
  }

  updateEmployeeData(empId: number, body: any): Observable<any> {
    return this.httpClient.put("http://localhost:8080/app/update/"+empId, body);
  }


  private employeeSource = new BehaviorSubject(new Employee());
  currentEmployee = this.employeeSource.asObservable();

  changeEmployee(employee: Employee) {
    this.employeeSource.next(employee)
  }
}

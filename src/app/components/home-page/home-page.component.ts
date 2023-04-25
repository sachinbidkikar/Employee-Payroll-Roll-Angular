import { Component, OnInit } from '@angular/core';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/service/employee.service';
import { Router } from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

employeeCount: number = 0;
employeeList: Employee[] = []

constructor(private employeeService: EmployeeService, private router: Router,private snackBar: MatSnackBar){}

ngOnInit(): void {
  this.employeeService.getEmployeeData().subscribe(response => {
    this.employeeList = response.object;
    console.log(response);   
      this.employeeCount = this.employeeList.length;
      console.log(this.employeeList);
  })
}


remove(empId: number): void {
  console.log("Id is:::"+empId)
  this.employeeService.deleteEmployeeData(empId).subscribe(response => {
    console.log(response);
    this.ngOnInit();
    alert("Employee Data Has been Removed")
  });
}

update(employee: any){
  this.employeeService.changeEmployee(employee);
this.router.navigate(['update/',employee.empId])
console.log(employee.empId);

}

}

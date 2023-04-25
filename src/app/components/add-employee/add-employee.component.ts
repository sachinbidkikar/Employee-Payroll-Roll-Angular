import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { Employee } from 'src/app/models/employee';
import { EmployeeService } from 'src/app/service/employee.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.scss']
})
export class AddEmployeeComponent {

  public employee: Employee = new Employee();
  public employeeFormGroup!: FormGroup;
  empId = this.route.snapshot.params['empId']

  constructor(private formBuilder: FormBuilder, private router: Router, private employeeService: EmployeeService, private route: ActivatedRoute,private snackBar: MatSnackBar) {

    this.employeeFormGroup = this.formBuilder.group({
      name: new FormControl('', [Validators.required, Validators.pattern("^[A-Z][a-zA-Z\\s]{2,}$"),]),
      profilePic: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      department: this.formBuilder.array([], [Validators.required]),
      salary: new FormControl('', []),
      startDate: new FormControl('', [Validators.required]),
      notes: new FormControl('', [Validators.required])
    })
  }

  departments: Array<any> = [
    {
      id: 1,
      name: "HR",
      value: "HR",
      checked: false
    },
    {
      id: 2,
      name: "Sales",
      value: "Sales",
      checked: false
    },
    {
      id: 3,
      name: "Finance",
      value: "Finance",
      checked: false
    },
    {
      id: 4,
      name: "Engineer",
      value: "Engineer",
      checked: false
    },
    {
      id: 5,
      name: "Other",
      value: "Other",
      checked: false
    }
  ]

  onCheckboxChange(event: MatCheckboxChange) {
    const department: FormArray = this.employeeFormGroup.get('department') as FormArray;
    if (event.checked) {
      department.push(new FormControl(event.source.value));
    } else {
      const index = department.controls.findIndex(x => x.value === event.source.value);
      department.removeAt(index);
    }
  }


  /**
   * To Show  error 
   */
  public myError = (controlName: string, errorName: string) => {
    return this.employeeFormGroup.controls[controlName].hasError(errorName)
  }

  /**
   * To read Salary value from slider
   */
  salary: number = 0;
  updateSetting(event: any) {
    this.salary = event.value;
  }

  formatLabel(value: any): string {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }
    return `${value}`;
  }

  ngOnInit(): void {
        // Getting all the data of employee for update :-
    if (this.empId != undefined) {
      this.employeeService.currentEmployee.subscribe(employee => {
        this.employeeFormGroup.get('name')?.setValue(employee.name);
        this.employeeFormGroup.get('gender')?.setValue(employee.gender);
        this.employeeFormGroup.get('salary')?.setValue(employee.salary);
        this.employeeFormGroup.get('startDate')?.setValue(employee.startDate);
        this.employeeFormGroup.get('notes')?.setValue(employee.notes);
        this.employeeFormGroup.get('profilePic')?.setValue(employee.profilePic);


        const departmentName: FormArray = this.employeeFormGroup.get('department') as FormArray;
        employee.department.forEach(departmentData => {
          for (let i = 0; i < this.departments.length; i++) {
            if (this.departments[i].name === departmentData) {
              this.departments[i].checked = true;
              console.log("individaul :::"+departmentData);
                      
              departmentName.push(new FormControl(this.departments[i].value))
            }
          }
        });
      });
    }
  }

 
  onSubmit() {
    if (this.employeeFormGroup.valid) {
      // updating employee data by calling http method :-
      this.employee = this.employeeFormGroup.value;
      if (this.empId != undefined) {
        this.employeeService.updateEmployeeData(this.empId, this.employee).subscribe(response => {
          console.log(response);  
          this.snackBar.open("Data Updated for: "+response.object.name,"ok");        
          this.router.navigateByUrl("/home-page");
        });
      } else {
        // adding employee data by calling http method :-
        this.employee = this.employeeFormGroup.value;
        this.employeeService.addEmployeeData(this.employee).subscribe(response => {
          console.log(response);      
          this.snackBar.open("New Employee Added","ok");
   
          this.router.navigateByUrl("/home-page");
        });
      }
    }
  }
}

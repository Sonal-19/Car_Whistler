import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, AbstractControl, Validators } from "@angular/forms";
import { AuthService } from "src/app/services/auth.service";
import { environment } from "src/environments/environment";
import { StorageService } from "src/app/services/storage.service";
import SweetAlert from "src/app/utils/sweetAlert";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  submitted = false;
  env = environment;

  form: FormGroup = new FormGroup({
    username: new FormControl(""),
    password: new FormControl(""),
  });

  isLoggedIn = false;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private storageService: StorageService) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }

    this.form = this.formBuilder.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
    });

    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
    }
  }

  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
      return;
    }

    const reqBody = JSON.stringify(this.form.value, null, 2);
    this.authService.signIn(reqBody).subscribe({
      next: (data) => {
        if ((data.data.status = 200)) {
          this.storageService.saveUser(data);

          this.isLoggedIn = true;
          this.reloadPage();
        } else {
          SweetAlert.errorAlert("Error!", data.data.message);
        }
      },
      error: (err) => {
        SweetAlert.errorAlert("Error!", err.error.message);
      },
    });
  }

  reloadPage(): void {
    window.location.reload();
  }
}

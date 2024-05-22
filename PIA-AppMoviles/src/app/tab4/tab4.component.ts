import { Component, DoCheck, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { AbstractControl, ValidatorFn } from '@angular/forms';

interface userInfo {
  'username': string | null| undefined,
  'email': string | null| undefined,
  'photoURL': string | null| undefined,
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.component.html',
  styleUrls: ['./tab4.component.scss'],
})

export class Tab4Component  implements DoCheck {

    currentUserInfo: userInfo = {
      username: '',
      email: '',
      photoURL: '',
    };

  
  constructor(private authService: AuthService,
    private _router: Router,
    private formBuilder : FormBuilder,
  ) {}

  UserNameForm = this.formBuilder.group({
    username: ['', Validators.required]
  })

  PasswordForm = this.formBuilder.group({
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required],
  }, { validators:  this.samePassword()} 
)

  public alertButtons = [
    {
      text: 'Cancelar',
      role: 'cancel',
      handler: () => {
        console.log('cancel')
      },
    },
    {
      text: 'Continuar',
      role: 'confirm',
      handler: () => {
        this.updatePassword();
      },
    },
  ];

  ngDoCheck() {
    this.currentUserInfo = this.authService.getUserInfo()
    if (!this.currentUserInfo.photoURL)
      this.currentUserInfo.photoURL = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRip_-yACYt4Zrk3aQ7A-EgThBZ_5Cf5gaP8xlLUFH13Q&s";
  }


  async updateUserName(){
    if (this.UserNameForm.value.username)
    await this.authService.updateUsername(this.UserNameForm.value.username)

    this.UserNameForm.reset();
  }

  async updatePassword(){
    if (this.PasswordForm.value.password)
    await this.authService.changePassword(this.PasswordForm.value.password)

    this.PasswordForm.reset();
  }

  async logOut(){
    try {
      await this.authService.logOut();
      this._router.navigateByUrl('/');
    } catch (error) {
      console.log(error)
    }
  }

  samePassword(): ValidatorFn {
    return (control: AbstractControl): {[ key: string ]: any } | null => {
      const password = control.get('password');
      const confirmPassword = control.get('confirmPassword');

      if (password && confirmPassword && password.value !== confirmPassword.value){
        return {'distinctPasswords': true};
      }
      return null;
    }
  }

}

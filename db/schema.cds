namespace db;

entity Session {
    key ID       : Integer;
        User     : Association to User;
        Name     : String;
        Messages : Association to many Message
                       on Messages.Session = $self;
}

entity User {
    key ID       : Integer;
        Name     : String;
        Sessions : Association to many Session
                       on Sessions.User = $self;
        Messages : Association to many Message
                       on Messages.User = $self;
}

entity Message {
    key ID      : Integer;
        Session : Association to one Session;
        role    : Role;
        content : String;
        User    : Association to one User;
        Date    : Date;
}

type Role : String enum {
    assistant;
    user;
    system;
}

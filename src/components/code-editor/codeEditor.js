import axios from "axios";
import Codemirror from "codemirror-editor-vue3";
import "codemirror/addon/display/placeholder.js";
import "codemirror/mode/clike/clike";
import "codemirror/theme/dracula.css";
import state from "../../store/index";
import { Component, Prop, Vue } from "vue-facing-decorator";

@Component({
  components: { Codemirror },
  setup() {
    return {
      cmOptions: {
        lineNumbers: true,
        mode: "text/x-java", // Language mode
        theme: "dracula", // Theme
      },
    };
  }
})
export default class CodeEditor extends Vue {
  @Prop({ type: Object }) defaultInput;
  @Prop({ type: String }) codeTemplate;
  sizeheight = 300;
  code = '';
  Enabletrace = { msg: "enable Trace Mood", switch: false };
  userIp = "";
  errors = "";
  
  async compileAndRun() {
    const playload = {
      language: "java",
      code: this.code,
      mode: this.Enabletrace.switch,
      userIp: this.userIp,
      input: this.defaultInput,
    };

    await axios
      .post("http://localhost:5000/run", playload)
      .then((response) => {
        state.lastRunnedStatus = "Accepted";
        this.$emit(
          "showOutput",
          response.data.output,
          true,
          this.userIp === "" && this.Enabletrace.switch === false
            ? "showWithDefault"
            : ""
        );
      })
      .catch((error) => {
        state.lastRunnedStatus = "Error";
        this.errors = "compilation failed";
        if (error.response.status === 400) {
          this.errors = "Declaraction MisMatch";
          this.$emit("showOutput", error.response.data.error, false);
        } else if (
          error.response.status === 500 &&
          Object.values(error.response.data.error).length === 0
        ) {
          this.errors = "Declaraction MisMatch";
          this.$emit(
            "showOutput",
            "Error:Internal Server Error\n\r Declarations are wrong",
            false,
            ""
          );
        } else {
          console.log(error);
          this.$emit(
            "showOutput",
            error.response.data.error.stderr.split("error:"),
            false,
            ""
          );
        }
      });
  };
  async submit() {
    if (this.Enabletrace.switch) {
      alert("You Can Submit On Trace Mood");
      return;
    }
    await this.compileAndRun();
    this.$emit("submit", this.code, this.errors);
  };

  toggle() {
    // popUp a msg it will show your code will disapper click checkBox to preserve [] ok and cancle button
    this.Enabletrace.switch = !this.Enabletrace.switch;

    if (this.Enabletrace.switch) {
      this.Enabletrace.msg = "disable Trace mood";
      this.code = `//now you can practice and trace you code flow
 class Main {

   public static void main(String[] args) {
       System.out.println("hello world");
     }
 }
 `;
    } else {
      this.Enabletrace.msg = "enable Trace Mood";
      this.code = this.codeTemplate;
    }
  };

  created(){
    this.code=this.codeTemplate;
  };
}
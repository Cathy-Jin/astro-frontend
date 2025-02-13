import Footer from "./Footer";
import NavBar from "./NavBar";

const Term = () => {
  return (
    <div className="term">
      <NavBar />
      <div className="main-content">
        <h1>服务条款</h1>
        <div className="term-item">
          <p>
            最后更新日期： 2025年2月10日
            <br />
            生效日期： 2025年2月10日
            <br />
            <i>
              本条款仅适用于个人兴趣项目，不构成法律建议。如果您需要专业合规方案，请咨询律师。
            </i>
          </p>
          <hr />
        </div>
        <div className="term-item">
          <h3>服务概述</h3>
          <p>
            本网站（以下简称“我们”或“本平台”）提供基于现代占星学的档案创建与分析服务。
          </p>
        </div>
        <div className="term-item">
          <h3>用户责任</h3>
          <p>
            <b>数据合法性：</b>
            如果您输入他人的出生时间或其他信息，需确保已获得其明确同意。
            <br />
            <b>账户安全：</b>
            您需妥善保管账户信息（如密码），并对账户下的所有活动负责。 <br />
            <b>禁止行为：</b>您不得利用本服务从事以下行为：
            <ul>
              <li>发布虚假、违法或侵权内容。</li>
              <li>干扰或破坏本平台的正常运行。</li>
              <li>尝试未经授权的数据访问或篡改。</li>
            </ul>
          </p>
        </div>
        <div className="term-item">
          <h3>服务变更与终止</h3>
          <p>
            我们保留随时修改、暂停或终止服务的权利，恕不另行通知。
            <br />
            如果您违反本条款，我们有权立即终止您的账户访问权限。
          </p>
        </div>
        <div className="term-item">
          <h3>免责声明</h3>
          <p>
            <b>服务“按原样”提供：</b>
            我们不对服务的准确性、可靠性或适用性作任何明示或暗示的保证。
            <br />
            <b>本平台内容仅供参考：</b>
            本平台生成的内容仅供娱乐和个人兴趣使用，不构成任何专业建议（如医疗、金融或法律建议）。
            <br />
            <b>技术风险：</b>
            作为个人项目，我们无法保证服务的持续可用性或数据绝对安全。您理解并接受使用本服务的潜在风险。
            <br />
          </p>
        </div>
        <div className="term-item">
          <h3>责任限制</h3>
          <p>
            在任何情况下，我们均不对因使用或无法使用本服务导致的直接、间接、特殊或后果性损害负责（包括但不限于数据丢失、利润损失或业务中断）。
          </p>
        </div>
        <div className="term-item">
          <h3>第三方链接</h3>
          <p>
            本网站可能包含指向第三方网站的链接。这些链接仅为方便用户提供，我们不对其内容或隐私实践负责。
          </p>
        </div>
        <div className="term-item">
          <h3>条款修改</h3>
          <p>
            我们保留随时修改本条款的权利。修改后的条款将在本页面公布，并在生效日期后对您具有约束力。继续使用服务即视为接受更新后的条款。
          </p>
        </div>
        <div className="term-item">
          <h3>联系我们</h3>
          <p>
            如有疑问，请通过
            <a href="mailto:astro.archive.contact@gmail.com">
              astro.archive.contact@gmail.com
            </a>
            与我们联系。
            <br />
            <b>请注意：</b>
            本网站为个人兴趣项目，无专业法律团队支持，回复可能延迟。
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Term;
